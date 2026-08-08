import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkObsidian from '../src/plugins/remark-obsidian.mjs';

test('renders Obsidian page links and callouts', async () => {
	const processor = await createMarkdownProcessor({ remarkPlugins: [remarkObsidian] });
	const { code } = await processor.render(`
# Target heading

[[#Target heading|Jump]]

> [!note] Remember
> Plain body

> [!example]- Answer
> Hidden body
`);

	assert.match(code, /<a href="#target-heading">Jump<\/a>/);
	assert.match(code, /<aside class="callout" data-callout="note">/);
	assert.match(code, /<div class="callout-title">Remember<\/div>/);
	assert.match(code, /<p>Plain body<\/p>/);
	assert.match(code, /<details class="callout" data-callout="example">/);
	assert.match(code, /<summary class="callout-title">Answer<\/summary>/);
	assert.doesNotMatch(code, /<details[^>]+open/);
	assert.match(code, /<p>Hidden body<\/p>/);
});

test('reports an unresolved page link', () => {
	const warnings = [];
	const tree = {
		type: 'root',
		children: [{ type: 'paragraph', children: [{ type: 'text', value: '[[#Missing]]' }] }],
	};

	remarkObsidian()(tree, { message: (message) => warnings.push(message) });

	assert.deepEqual(warnings, ['Unresolved Obsidian heading link: [[#Missing]]']);
});
