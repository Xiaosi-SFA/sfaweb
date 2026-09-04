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
    // 段首缩进（单位：em），文章详情默认 2
    indent: z.number().int().nonnegative().default(2),
    // 兼容字段：int（如提供则可覆盖 indent），单位同上
    int: z.number().int().nonnegative().optional(),
    // 页面默认正文对齐：left | center | right
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
    // 段首缩进（单位：em），活动详情默认 0
    indent: z.number().int().nonnegative().default(0),
    // 兼容字段：int（如提供则可覆盖 indent），单位同上
    int: z.number().int().nonnegative().optional(),
    // 页面默认正文对齐：left | center | right
    align: z.enum(['left', 'center', 'right']).optional(),
  }),
})

// Friend links collection
const links = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(), // 站点/名称
    url: z.string().url(),
    description: z.string().max(400),
    // 支持远程 URL 或本地 public 下的路径（以 / 开头），统一使用字符串
    logo: z.string().optional(),
  }),
})

// ——— Departments and Members ———
const departments = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200).optional(),
    intro: z.union([z.string(), z.array(z.string())]).optional(),
    duties: z.array(z.string()).optional(),
    order: z.number().optional(),
    linkedActivities: z.array(z.string()).optional(),
    // 部门简介正文对齐
    align: z.enum(['left', 'center', 'right']).optional(),
  }),
})

const members = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    quote: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    position: z.enum(['minister', 'vice-minister', 'member']).optional(),
  }),
})

// Department gallery entries, organized by folder: src/content/deptGallery/{dept}/...
const deptGallery = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.date(),
    image: z.string(),
    intro: z.string().max(400),
    link: z.string().url().optional(),
  }),
})

// Interest groups collection
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
    // 小组页面正文对齐
    align: z.enum(['left', 'center', 'right']).optional(),
  }),
})

// About page (singleton) collection
const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    intro: z.string().max(600).optional(),
    updated: z.date().optional(),
    // 关于页正文对齐
    align: z.enum(['left', 'center', 'right']).optional(),
  }),
})

// Ribbon data collection (JSON arrays under src/content/ribbon/*.json)
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

// Re-export valid collections
export const collections = { articles, activity, links, departments, members, deptGallery, groups, about, ribbon }
