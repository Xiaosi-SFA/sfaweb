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
    tags: z.array(z.string()).default([]),
    summary: z.string().max(280).optional(),
    cover: z.string().optional(),
    link: z.string().url().optional(),
  }),
})

// collections export
 
// Events collection for timeline
const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    tags: z.array(z.string()).default([]),
    summary: z.string().max(280).optional(),
    cover: z.string().optional(),
    location: z.string().optional(),
  }),
})

// Friend links collection
const links = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(), // 站点/名称
    url: z.string().url(),
    description: z.string().max(400),
    logo: z.string().optional(), // 图片或图标路径
  }),
})

export const collections = { articles, news, events, links }
