import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { articleId } from './utils/content.mjs';

const schema = z.object({
	title: z.string(),
	description: z.string().optional(),
	pubDate: z.coerce.date(),
	updatedDate: z.coerce.date().optional(),
});

const blog = defineCollection({
	loader: glob({
		base: './src/content/blog',
		pattern: ['**/*.{md,mdx}', '!README.md'],
		generateId: ({ entry }) => articleId(entry),
	}),
	schema,
});

const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '*.{md,mdx}' }),
	schema: ({ image }) =>
		schema.extend({
			friends: z
				.array(
					z.object({
						name: z.string(),
						description: z.string(),
						url: z.string().url(),
						avatar: image(),
					}),
				)
				.optional(),
		}),
});

export const collections = { blog, pages };
