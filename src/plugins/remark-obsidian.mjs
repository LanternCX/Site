import { slug } from 'github-slugger';

const WIKI_LINK = /\[\[#([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const CALLOUT = /^\[!([^\]\s]+)\]([+-]?)(?:[ \t]+([^\n]*))?(?:\n([\s\S]*))?$/;

export default function remarkObsidian() {
	return (tree, file) => {
		const headings = collectHeadingSlugs(tree);
		transformCallouts(tree);
		transformWikiLinks(tree, false, headings, file);
	};
}

function transformCallouts(node) {
	if (node.type === 'blockquote') {
		const paragraph = node.children[0];
		const text = paragraph?.type === 'paragraph' ? paragraph.children[0] : undefined;
		const match = text?.type === 'text' ? CALLOUT.exec(text.value) : undefined;

		if (match) {
			const [, rawType, fold, rawTitle, body = ''] = match;
			const type = rawType.toLowerCase();
			const collapsible = fold === '+' || fold === '-';
			const title = rawTitle?.trim() || `${type[0].toUpperCase()}${type.slice(1)}`;

			node.data = {
				hName: collapsible ? 'details' : 'aside',
				hProperties: {
					className: ['callout'],
					dataCallout: type,
					...(fold === '+' ? { open: true } : {}),
				},
			};

			text.value = body;
			if (!body && paragraph.children.length === 1) node.children.shift();
			node.children.unshift({
				type: 'paragraph',
				children: [{ type: 'text', value: title }],
				data: {
					hName: collapsible ? 'summary' : 'div',
					hProperties: { className: ['callout-title'] },
				},
			});
		}
	}

	for (const child of node.children ?? []) transformCallouts(child);
}

function transformWikiLinks(node, insideLink, headings, file) {
	if (!node.children) return;

	for (let index = 0; index < node.children.length; index++) {
		const child = node.children[index];
		if (child.type === 'text' && !insideLink) {
			const replacement = splitWikiLinks(child.value, headings, file);
			if (replacement) {
				node.children.splice(index, 1, ...replacement);
				index += replacement.length - 1;
			}
		} else {
			transformWikiLinks(child, insideLink || child.type === 'link', headings, file);
		}
	}
}

function splitWikiLinks(value, headings, file) {
	const nodes = [];
	let start = 0;

	for (const match of value.matchAll(WIKI_LINK)) {
		if (match.index > start) nodes.push({ type: 'text', value: value.slice(start, match.index) });
		const target = match[1].trim();
		if (!headings.has(slug(target))) {
			file.message(`Unresolved Obsidian heading link: [[#${target}]]`);
		}
		nodes.push({
			type: 'link',
			url: `#${slug(target)}`,
			children: [{ type: 'text', value: match[2]?.trim() || target }],
		});
		start = match.index + match[0].length;
	}

	if (start === 0) return undefined;
	if (start < value.length) nodes.push({ type: 'text', value: value.slice(start) });
	return nodes;
}

function collectHeadingSlugs(tree) {
	const headings = new Set();
	visit(tree, (node) => {
		if (node.type === 'heading') headings.add(slug(textContent(node)));
	});
	return headings;
}

function visit(node, callback) {
	callback(node);
	for (const child of node.children ?? []) visit(child, callback);
}

function textContent(node) {
	if (node.type === 'text' || node.type === 'inlineCode') return node.value;
	return (node.children ?? []).map(textContent).join('');
}
