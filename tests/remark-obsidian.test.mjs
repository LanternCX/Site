import assert from 'node:assert/strict';
import test from 'node:test';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkObsidian from '../src/plugins/remark-obsidian.mjs';

test('renders Obsidian page links and callouts', async () => {
	const processor = await createMarkdownProcessor({
		remarkPlugins: [
			[
				remarkObsidian,
				{
					articleEntries: [
						'README.md',
						'Note/Guide.md',
						'Robotic/Current/Current.md',
						'Robotic/Current/Sibling.md',
						'Robotic/DC Motor/DC Motor.md',
					],
					imageEntries: ['Robotic/Current/assets/photo.png'],
				},
			],
		],
	});
	const { code } = await processor.render(`
# Target heading

[[#Target heading|Jump]]

[[DC Motor#Control|Motor control]]

[[./Sibling]] [[../../Note/Guide]]

![[photo.png|320x180]]

![[Embedded article]]

> [!note] Remember
> Plain body

> [!example]- Answer
> Hidden body
`, { fileURL: new URL('file:///vault/Robotic/Current/Current.md') });

	assert.match(code, /<a href="#target-heading">Jump<\/a>/);
	assert.match(code, /<a href="\/blog\/robotic\/dc-motor\/dc-motor\/#control">Motor control<\/a>/);
	assert.match(code, /<a href="\/blog\/robotic\/current\/sibling\/">\.\/Sibling<\/a>/);
	assert.match(code, /<a href="\/blog\/note\/guide\/">\.\.\/\.\.\/Note\/Guide<\/a>/);
	assert.match(code, /&#x22;src&#x22;:&#x22;\.\/assets\/photo\.png/);
	assert.match(code, /&#x22;alt&#x22;:&#x22;photo/);
	assert.match(code, /&#x22;width&#x22;:320/);
	assert.match(code, /&#x22;height&#x22;:180/);
	assert.match(code, /!\[\[Embedded article\]\]/);
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

test('reports unresolved and ambiguous article links', () => {
	const warnings = [];
	const tree = {
		type: 'root',
		children: [{ type: 'paragraph', children: [{ type: 'text', value: '[[Missing]] [[Shared]]' }] }],
	};

	remarkObsidian({ articleEntries: ['One/Shared.md', 'Two/Shared.md'] })(tree, {
		message: (message) => warnings.push(message),
	});

	assert.deepEqual(warnings, [
		'Unresolved Obsidian article link: [[Missing]]',
		'Ambiguous Obsidian article link: [[Shared]]',
	]);
});
