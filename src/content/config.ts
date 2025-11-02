import { defineCollection, z } from 'astro:content'

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().default('SFA'),
    tags: z.array(z.string()).default([]),
    summary: z.string().max(280).optional(),
    cover: z.string().optional(),
  }),
})

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    category: z.string().default('公告'),
    link: z.string().url().optional(),
  }),
})

export const collections = { articles, news }
