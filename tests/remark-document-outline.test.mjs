import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkDocumentOutline from '../src/plugins/remark-document-outline.mjs';

test('reserves the primary heading for the article layout', async () => {
	const processor = await createMarkdownProcessor({ remarkPlugins: [remarkDocumentOutline] });
	const { code } = await processor.render('# Article title\n\n## Section');

	assert.doesNotMatch(code, /<h1/);
	assert.equal(code.match(/<h2/g)?.length, 2);
});

test('normalizes a body title independently of frontmatter', async () => {
	const processor = await createMarkdownProcessor({ remarkPlugins: [remarkDocumentOutline] });
	const { code } = await processor.render('Intro metadata.\n\n# Article **title**\n\nBody');

	assert.match(code, /<h2[^>]*>Article <strong>title<\/strong><\/h2>/);
	assert.match(code, /<p>Body<\/p>/);
});
