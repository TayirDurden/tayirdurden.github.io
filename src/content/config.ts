// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const novelCollection = defineCollection({
  type: 'content', 
  schema: z.object({
    title: z.string(),
    // Allow both 'order' and 'chapter_number' so your sorting works
    order: z.number().optional(),
    chapter_number: z.number().optional(),
    // Allow 'lang' so Astro reads it (even if we deduce it from folders)
    lang: z.string().optional(),
  }),
});

export const collections = {
  'novel': novelCollection,
};