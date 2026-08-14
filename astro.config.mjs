// @ts-check

import mdx from '@astrojs/mdx';
import { parseFrontmatter, unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';
import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import remarkDocumentOutline from './src/plugins/remark-document-outline.mjs';
import remarkObsidian from './src/plugins/remark-obsidian.mjs';
import { articleId, articleRedirects, isArticle, permalinkIndex } from './src/utils/content.mjs';

const blogRoot = 'src/content/blog';
const articleEntries = globSync('**/*.{md,mdx}', { cwd: blogRoot });
const imageEntries = globSync('**/*.{apng,avif,gif,jpeg,jpg,png,svg,webp}', { cwd: blogRoot });
const articles = articleEntries
	.filter((entry) => entry.replaceAll('\\', '/').includes('/'))
	.filter((entry) => isArticle(articleId(entry)))
	.map((entry) => {
		const { frontmatter } = parseFrontmatter(readFileSync(join(blogRoot, entry), 'utf8'));
		return { entry, permalink: frontmatter.permalink, redirectFrom: frontmatter.redirectFrom };
	});
const articlePermalinks = permalinkIndex(articles.map(({ entry, permalink }) => [entry, permalink]));

// https://astro.build/config
export default defineConfig({
	site: 'https://www.caoxin.xyz',
	redirects: articleRedirects(articles),
	devToolbar: { enabled: false },
	integrations: [mdx(), sitemap()],
	markdown: {
		processor: unified({
			remarkPlugins: [
				remarkMath,
				remarkDocumentOutline,
				[remarkObsidian, { articleEntries, articlePermalinks, imageEntries }],
			],
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
