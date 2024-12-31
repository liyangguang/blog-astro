import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		tags: z
			.array(z.string()),
		isTil: z.boolean().optional(),  // is short TIL
		heroImage: z
			.string()
			.optional(),
		isFeatured: z.boolean().optional(),
	}),
});

export const collections = { blog };
