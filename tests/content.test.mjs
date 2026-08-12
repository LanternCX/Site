import assert from 'node:assert/strict';
import test from 'node:test';
import { articleId, pagesOf, paginationItems } from '../src/utils/content.mjs';

test('article IDs follow their vault-relative paths', () => {
	assert.equal(articleId('Category/Nested Folder/Article.md'), 'category/nested-folder/article');
	assert.equal(articleId('Another Category/Article.mdx'), 'another-category/article');
});

test('pagination helpers split and abbreviate pages', () => {
	assert.deepEqual(pagesOf([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
	assert.deepEqual(paginationItems(1, 8), [1, 2, 3, 4, '…', 8]);
	assert.deepEqual(paginationItems(5, 8), [1, '…', 5, 6, 7, 8]);
	assert.deepEqual(paginationItems(8, 8), [1, '…', 5, 6, 7, 8]);
});
