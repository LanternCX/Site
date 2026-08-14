// @ts-check

import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { globSync } from 'node:fs';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkDocumentOutline from './src/plugins/remark-document-outline.mjs';
import remarkObsidian from './src/plugins/remark-obsidian.mjs';

const articleEntries = globSync('**/*.{md,mdx}', { cwd: 'src/content/blog' });
const imageEntries = globSync('**/*.{apng,avif,gif,jpeg,jpg,png,svg,webp}', { cwd: 'src/content/blog' });

// https://astro.build/config
export default defineConfig({
	site: 'https://www.caoxin.xyz',
	devToolbar: { enabled: false },
	integrations: [mdx(), sitemap()],
	markdown: {
		processor: unified({
			remarkPlugins: [remarkMath, remarkDocumentOutline, [remarkObsidian, { articleEntries, imageEntries }]],
			rehypePlugins: [[rehypeKatex, { strict: false }]],
		}),
	},
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
