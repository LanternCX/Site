export const categoryOf = (id) => id.split('/')[0];
export const categoryLabel = (id, filePath) =>
	filePath?.replaceAll('\\', '/').split('/blog/')[1]?.split('/')[0] ?? categoryOf(id);
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
