import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const articles = await getCollection('articles')
  const counter = new Map<string, number>()
  for (const a of articles) {
    for (const t of a.data.tags ?? []) {
      counter.set(t, (counter.get(t) ?? 0) + 1)
    }
  }
  const items = [...counter.entries()]
    .map(([tag, count]) => ({ tag, count, url: `/tags/${encodeURIComponent(tag)}/` }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'zh-CN'))

  return new Response(JSON.stringify({ count: items.length, items }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
