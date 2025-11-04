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
  }),
})


 
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
    hostType: z.enum(['group', 'department']).optional(),
    hostSlug: z.string().optional(),
    // 段首缩进（单位：em），活动详情默认 0
    indent: z.number().int().nonnegative().default(0),
    // 兼容字段：int（如提供则可覆盖 indent），单位同上
    int: z.number().int().nonnegative().optional(),
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

// (moved to bottom export)

// ——— Departments and Members ———
const departments = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string().max(200).optional(),
    intro: z.union([z.string(), z.array(z.string())]).optional(),
    duties: z.array(z.string()).optional(),
    order: z.number().optional(),
    linkedEvents: z.array(z.string()).optional(), // 手动引用的活动 slug 列表
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

// Department gallery entries, organized by folder: src/content/dept-gallery/{dept}/...
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
    linkedEvents: z.array(z.string()).optional(), // 手动引用的活动 slug 列表
    leader: z
      .object({
        name: z.string(),
        avatar: z.string().optional(),
        quote: z.string().optional(),
        bio: z.string().optional(),
      })
      .optional(),
    order: z.number().optional(),
  }),
})

// About page (singleton) collection
const about = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    intro: z.string().max(600).optional(),
    updated: z.date().optional(),
  }),
})

// i18n language data collection
// Each file under src/content/lang/{locale}/{namespace}.json(yaml) should follow:
// {
//   "locale": "zh",
//   "namespace": "common",
//   "messages": { "nav": { "home": "首页", ... } }
// }
const lang = defineCollection({
  type: 'data',
  schema: z.object({
    locale: z.string(),
    namespace: z.string().default('common'),
    messages: z.record(z.any()),
  }),
})

// Re-export including new collections
export const collections = { articles, events, links, departments, members, deptGallery, groups, about, lang }
