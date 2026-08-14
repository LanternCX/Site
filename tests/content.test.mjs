import assert from 'node:assert/strict';
import test from 'node:test';
import {
	articleId,
	articleRedirects,
	categoryOf,
	pagesOf,
	paginationItems,
	permalinkIndex,
} from '../src/utils/content.mjs';

test('article IDs follow their vault-relative paths', () => {
	assert.equal(articleId('Category/Nested Folder/Article.md'), 'category/nested-folder/article');
	assert.equal(articleId('Another Category/Article.mdx'), 'another-category/article');
});

test('permalinks are present, URL-safe, and unique', () => {
	assert.deepEqual(
		[...permalinkIndex([
			['Category/First.md', 'first-article'],
			['Category/Second.md', 'second-article'],
		])],
		[
			['Category/First.md', 'first-article'],
			['Category/Second.md', 'second-article'],
		],
	);
	assert.throws(() => permalinkIndex([['Category/First.md', 'Not Safe']]), /Invalid permalink/);
	assert.throws(
		() => permalinkIndex([['Category/First.md', 'same'], ['Category/Second.md', 'same']]),
		/Duplicate permalink/,
	);
});

test('old vault paths and declared aliases redirect to permalinks', () => {
	assert.deepEqual(articleRedirects([
		{ entry: 'Category/Long Article.md', permalink: 'short', redirectFrom: ['category/older-name'] },
	]), {
		'/blog/category/long-article/': '/blog/short/',
		'/blog/category/older-name/': '/blog/short/',
	});
});

test('categories remain based on the vault folder', () => {
	assert.equal(categoryOf('short-link', '/repo/src/content/blog/ACM-ICPC/Article.md'), 'acm-icpc');
});

test('pagination helpers split and abbreviate pages', () => {
	assert.deepEqual(pagesOf([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
	assert.deepEqual(paginationItems(1, 8), [1, 2, 3, 4, '…', 8]);
	assert.deepEqual(paginationItems(5, 8), [1, '…', 5, 6, 7, 8]);
	assert.deepEqual(paginationItems(8, 8), [1, '…', 5, 6, 7, 8]);
});
