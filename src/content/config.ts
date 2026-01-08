import { defineCollection, z } from 'astro:content';

const novelCollection = defineCollection({
  // 'content' type is for Markdown (.md) or MDX (.mdx) files
  type: 'content', 
  schema: z.object({
    // Every chapter MUST have a title string
    title: z.string(),
    
    // Sort order: can be 'order' or 'chapter_number'
    // .optional() prevents the build from crashing if one is missing
    order: z.number().optional(),
    chapter_number: z.number().optional(),
    
    // Language: though we use folders (en/tr), 
    // having it in frontmatter is good for SEO logic
    lang: z.string().optional(),
    
    // Optional: Add a description or publish date if you want later
    description: z.string().optional(),
    pubDate: z.date().optional(),
  }),
});

// This name 'novel' must match your folder name in src/content/novel
export const collections = {
  'novel': novelCollection,
};