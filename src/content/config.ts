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
    indent: z.number().int().nonnegative().default(2),
    int: z.number().int().nonnegative().optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
  }),
})

const activity = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    author: z.string().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().max(280).optional(),
    cover: z.string().optional(),
    location: z.string().optional(),
    hostType: z.enum(['group', 'department']).optional(),
    hostSlug: z.string().optional(),
    indent: z.number().int().nonnegative().default(0),
    int: z.number().int().nonnegative().optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
  }),
})

const links = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    url: z.string().url(),
    description: z.string().max(400),
    logo: z.string().optional(),
  }),
})

const departments = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200).optional(),
    intro: z.union([z.string(), z.array(z.string())]).optional(),
    duties: z.array(z.string()).optional(),
    order: z.number().optional(),
    linkedActivities: z.array(z.string()).optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
  }),
})

const members = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string().optional(),
    quote: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    position: z.enum(['minister', 'vice-minister', 'member']).optional(),
    label: z.string().optional(),
    github: z.string().optional(),
  }),
})

const deptGallery = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.date(),
    image: z.string(),
    intro: z.string().max(400),
    link: z.string().url().optional(),
  }),
})

const groups = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    intro: z.string().max(400),
    activities: z.array(z.string()).min(1),
    avatar: z.string().optional(),
    linkedActivities: z.array(z.string()).optional(),
    leader: z
      .object({
        name: z.string(),
        avatar: z.string().optional(),
        quote: z.string().optional(),
        bio: z.string().optional(),
      })
      .optional(),
    order: z.number().optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
  }),
})

const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    intro: z.string().max(600).optional(),
    updated: z.date().optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
  }),
})

const ribbon = defineCollection({
  type: 'data',
  schema: z.array(
    z.object({
      src: z.string(),
      href: z.string().optional(),
      ratio: z.union([z.number(), z.string()]).optional(),
      alt: z.string().optional(),
      credit: z.string().optional(),
      copyright: z.string().optional(),
    })
  ),
})

export const collections = { articles, activity, links, departments, members, deptGallery, groups, about, ribbon }
