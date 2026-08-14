import { slug } from 'github-slugger';

export const PERMALINK_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const ARTICLE_PATH_PATTERN = /^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?(?:\/[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?)*$/;

export const permalinkOf = (entry, permalink) => {
	if (!PERMALINK_PATTERN.test(permalink ?? '')) {
		throw new Error(`Invalid permalink for ${entry}: ${permalink ?? '(missing)'}`);
	}
	return permalink;
};

export const articleId = (entry) => {
	const parts = entry.replaceAll('\\', '/').replace(/\.mdx?$/i, '').split('/');
	if (parts.length < 2) throw new Error(`Article entry must be inside a category: ${entry}`);
	return parts.map((part) => slug(part)).join('/');
};

export const permalinkIndex = (entries) => {
	const index = new Map();
	const used = new Set();
	for (const [entry, permalink] of entries) {
		permalinkOf(entry, permalink);
		if (used.has(permalink)) {
			throw new Error(`Duplicate permalink: ${permalink}`);
		}
		index.set(entry, permalink);
		used.add(permalink);
	}
	return index;
};

export const articleRedirects = (articles) => {
	const redirects = {};
	const canonical = new Set(articles.map(({ permalink }) => permalink));
	for (const { entry, permalink, redirectFrom = [] } of articles) {
		for (const source of [articleId(entry), ...redirectFrom]) {
			if (!ARTICLE_PATH_PATTERN.test(source)) throw new Error(`Invalid redirect path: ${source}`);
			if (source === permalink) continue;
			if (canonical.has(source)) throw new Error(`Redirect conflicts with permalink: ${source}`);
			const from = `/blog/${source}/`;
			const destination = `/blog/${permalink}/`;
			if (redirects[from] && redirects[from] !== destination) {
				throw new Error(`Duplicate redirect path: ${source}`);
			}
			redirects[from] = destination;
		}
	}
	return redirects;
};

const categoryFromPath = (filePath) =>
	filePath?.replaceAll('\\', '/').split('/blog/')[1]?.split('/')[0];

export const categoryOf = (id, filePath) => slug(categoryFromPath(filePath) ?? id.split('/')[0]);
export const categoryLabel = (id, filePath) =>
	categoryFromPath(filePath) ?? id.split('/')[0];
export const categoryAnchor = (category) => `category-${category.toLowerCase().replaceAll(' ', '-')}`;
export const formatDate = (date) => date.toISOString().slice(0, 10).replaceAll('-', '.');
export const firstHeading = (body) => body.match(/^#\s+(.+)$/m)?.[1].replace(/\*\*|__|`/g, '').trim();
export const outlineItems = (headings, title) => {
	const levels = [];
	return headings
		.filter(({ depth }) => depth >= 2 && depth <= 4)
		.filter(({ text }, index) => index > 0 || text !== title)
		.map((heading) => {
			levels[heading.depth - 2] = heading.text;
			levels.length = heading.depth - 1;
			return { ...heading, path: levels.filter(Boolean).join(' › ') };
		});
};
export const excerpt = (body, maxLength = 110) => {
	const plain = body
		.replace(/^---[\s\S]*?---\s*/, '')
		.replace(/^```[^\n]*$/gm, ' ')
		.replace(/<!--([\s\S]*?)-->/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
		.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
		.replace(/^#{1,6}\s+.*$/gm, ' ')
		.replace(/^\s*---+\s*$/gm, ' ')
		.replace(/^>\s*\[![^\]]+\].*$/gm, ' ')
		.replace(/^>\s?/gm, '')
		.replace(/^\s*(?:[-*+] |\d+\. )/gm, '')
		.replace(/[\*_`~]/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	const characters = [...plain];
	let end = maxLength;
	while (/[a-z\d]/i.test(characters[end - 1] ?? '') && /[a-z\d]/i.test(characters[end] ?? '')) end++;
	return characters.length > end ? `${characters.slice(0, end).join('').trimEnd()}…` : plain;
};

export const isArticle = (id) =>
	!id.startsWith('pages/') &&
	!id.endsWith('/readme') &&
	id !== 'readme' &&
	!id.endsWith('marp');

export const pagesOf = (items, pageSize) =>
	Array.from({ length: Math.ceil(items.length / pageSize) }, (_, index) =>
		items.slice(index * pageSize, (index + 1) * pageSize),
	);

export const paginationItems = (current, last) => {
	if (last <= 6) return Array.from({ length: last }, (_, index) => index + 1);
	if (current <= 4) return [1, 2, 3, 4, '…', last];
	if (current >= last - 3) return [1, '…', last - 3, last - 2, last - 1, last];
	return [1, '…', current - 1, current, current + 1, '…', last];
};
