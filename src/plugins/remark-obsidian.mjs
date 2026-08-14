import { slug } from 'github-slugger';
import { posix } from 'node:path';
import { articleId, isArticle } from '../utils/content.mjs';

const WIKI_LINK = /(!?)\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
const IMAGE_EXTENSION = /\.(?:apng|avif|gif|jpe?g|png|svg|webp)$/i;
const CALLOUT = /^\[!([^\]\s]+)\]([+-]?)(?:[ \t]+([^\n]*))?(?:\n([\s\S]*))?$/;

export default function remarkObsidian({ articleEntries = [], articlePermalinks = new Map(), imageEntries = [] } = {}) {
	const articleLinks = indexArticleLinks(articleEntries, articlePermalinks);
	const imageLinks = indexImageLinks(imageEntries);
	return (tree, file) => {
		const context = {
			headings: collectHeadingSlugs(tree),
			articleLinks,
			imageLinks,
			currentEntry: currentVaultEntry(file.path, articleEntries),
			file,
		};
		transformCallouts(tree);
		transformWikiLinks(tree, false, context);
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

function transformWikiLinks(node, insideLink, context) {
	if (!node.children) return;

	for (let index = 0; index < node.children.length; index++) {
		const child = node.children[index];
		if (child.type === 'text' && !insideLink) {
			const replacement = splitWikiLinks(child.value, context);
			if (replacement) {
				node.children.splice(index, 1, ...replacement);
				index += replacement.length - 1;
			}
		} else {
			transformWikiLinks(child, insideLink || child.type === 'link', context);
		}
	}
}

function splitWikiLinks(value, context) {
	const nodes = [];
	let start = 0;

	for (const match of value.matchAll(WIKI_LINK)) {
		if (match.index > start) nodes.push({ type: 'text', value: value.slice(start, match.index) });
		const target = match[2].trim();
		const label = match[3]?.trim();
		const replacement = match[1]
			? resolveImageEmbed(target, label, context)
			: resolveWikiLink(target, label, context);
		nodes.push(replacement ?? { type: 'text', value: match[0] });
		start = match.index + match[0].length;
	}

	if (start === 0) return undefined;
	if (start < value.length) nodes.push({ type: 'text', value: value.slice(start) });
	return nodes;
}

function resolveWikiLink(target, label, context) {
	const url = target.startsWith('#')
		? resolveHeadingLink(target.slice(1), context)
		: resolveArticleLink(target, context);
	return url
		? { type: 'link', url, children: [{ type: 'text', value: label || target.replace(/^#/, '') }] }
		: { type: 'text', value: label || target.replace(/^#/, '') };
}

function resolveHeadingLink(target, { headings, file }) {
	if (!headings.has(slug(target))) file.message(`Unresolved Obsidian heading link: [[#${target}]]`);
	return `#${slug(target)}`;
}

function resolveArticleLink(target, { articleLinks, currentEntry, file }) {
	const separator = target.indexOf('#');
	const article = separator === -1 ? target : target.slice(0, separator);
	const heading = separator === -1 ? '' : target.slice(separator + 1);
	const key = article.startsWith('.') && currentEntry
		? normalizeArticleTarget(posix.join(posix.dirname(currentEntry), article))
		: normalizeArticleTarget(article);
	const url = articleLinks.get(key);
	if (url === null) file.message(`Ambiguous Obsidian article link: [[${target}]]`);
	else if (!url) file.message(`Unresolved Obsidian article link: [[${target}]]`);
	return url && heading ? `${url}#${slug(heading)}` : url;
}

function resolveImageEmbed(target, label, { imageLinks, currentEntry, file }) {
	if (!IMAGE_EXTENSION.test(target)) {
		file.message(`Unsupported Obsidian embed: ![[${target}]]`);
		return undefined;
	}
	const key = target.startsWith('.') && currentEntry
		? vaultKey(posix.join(posix.dirname(currentEntry), target))
		: vaultKey(target);
	const image = imageLinks.get(key);
	if (image === null) file.message(`Ambiguous Obsidian image embed: ![[${target}]]`);
	else if (!image || !currentEntry) file.message(`Unresolved Obsidian image embed: ![[${target}]]`);
	if (!image || !currentEntry) return undefined;

	const dimensions = label?.match(/^(\d+)(?:[x×](\d+))?$/i);
	const node = {
		type: 'image',
		url: relativeUrl(posix.dirname(currentEntry), image),
		alt: dimensions || !label ? posix.basename(target, posix.extname(target)) : label,
	};
	if (dimensions) {
		node.data = {
			hProperties: {
				width: Number(dimensions[1]),
				...(dimensions[2] ? { height: Number(dimensions[2]) } : {}),
			},
		};
	}
	return node;
}

function indexArticleLinks(entries, permalinks) {
	const links = new Map();
	for (const entry of entries) {
		if (!entry.replaceAll('\\', '/').includes('/')) continue;
		const id = articleId(entry);
		if (!isArticle(id)) continue;
		const path = normalizeArticleTarget(entry);
		const permalink = permalinks.get(entry);
		if (!permalink) continue;
		const url = `/blog/${permalink}/`;
		for (const target of new Set([path, path.split('/').at(-1)])) {
			indexTarget(links, target, url);
		}
	}
	return links;
}

function indexImageLinks(entries) {
	const links = new Map();
	for (const entry of entries) {
		const path = vaultPath(entry);
		for (const target of new Set([vaultKey(path), vaultKey(posix.basename(path))])) {
			indexTarget(links, target, path);
		}
	}
	return links;
}

function indexTarget(index, target, value) {
	index.set(target, index.has(target) && index.get(target) !== value ? null : value);
}

function currentVaultEntry(filePath, entries) {
	if (!filePath) return undefined;
	const path = vaultKey(filePath);
	const entry = entries.find((candidate) => path.endsWith(`/${vaultKey(candidate)}`));
	return entry && vaultPath(entry);
}

function normalizeArticleTarget(target) {
	return vaultKey(target).replace(/\.mdx?$/i, '');
}

function vaultPath(target) {
	return target.replaceAll('\\', '/').replace(/^\/+|\/+$/g, '');
}

function vaultKey(target) {
	return vaultPath(target).toLowerCase();
}

function relativeUrl(from, to) {
	const relative = posix.relative(from, to);
	return relative.startsWith('.') ? relative : `./${relative}`;
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
