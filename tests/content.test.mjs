import assert from 'node:assert/strict';
import test from 'node:test';
import {
	categoryAnchor,
	categoryLabel,
	excerpt,
	firstHeading,
	isArticle,
	outlineItems,
	pagesOf,
	paginationItems,
} from '../src/utils/content.mjs';

test('content helpers classify generated Astro IDs', () => {
	assert.equal(categoryLabel('robotic/3dof-doc', 'src/content/blog/Robotic/3DOF Doc.md'), 'Robotic');
	assert.equal(categoryLabel('smart-car/race', 'src\\content\\blog\\Smart Car\\Race.md'), 'Smart Car');
	assert.equal(categoryAnchor('Smart Car'), 'category-smart-car');
	assert.equal(isArticle('agent/thinking-in-agent'), true);
	assert.equal(isArticle('agent/thinking-in-agentmarp'), false);
	assert.equal(isArticle('pages/about'), false);
	assert.equal(isArticle('acm-icpc/readme'), false);
	assert.equal(firstHeading('Intro\n\n# 面向 **Agent** 编程\n'), '面向 Agent 编程');
	assert.deepEqual(pagesOf([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
	assert.deepEqual(paginationItems(1, 8), [1, 2, 3, 4, '…', 8]);
	assert.deepEqual(paginationItems(5, 8), [1, '…', 5, 6, 7, 8]);
	assert.deepEqual(paginationItems(8, 8), [1, '…', 5, 6, 7, 8]);
	assert.equal(excerpt('```markdown\nVisible code content.\n```'), 'Visible code content.');
	assert.equal(
		excerpt('---\ntitle: DB\n---\n\n# 数据库系统原理\n\n---\n\n数据库并不只是一套 SQL 语法。', 12),
		'数据库并不只是一套 SQL…',
	);
});

test('article outlines keep three heading levels and their current path', () => {
	assert.deepEqual(
		outlineItems(
			[
				{ depth: 2, slug: 'title', text: 'Article' },
				{ depth: 2, slug: 'chapter', text: 'Chapter' },
				{ depth: 3, slug: 'section', text: 'Section' },
				{ depth: 4, slug: 'detail', text: 'Detail' },
				{ depth: 5, slug: 'ignored', text: 'Ignored' },
				{ depth: 2, slug: 'next', text: 'Next' },
			],
			'Article',
		).map(({ slug, path }) => ({ slug, path })),
		[
			{ slug: 'chapter', path: 'Chapter' },
			{ slug: 'section', path: 'Chapter › Section' },
			{ slug: 'detail', path: 'Chapter › Section › Detail' },
			{ slug: 'next', path: 'Next' },
		],
	);
});
