import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const limitParam = url.searchParams.get('limit')
  const limit = limitParam ? Math.max(1, Math.min(100, parseInt(limitParam))) : undefined

  let items = (await (getCollection as any)('news')) as any[]
  items = items.sort((a: any, b: any) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0))
  if (limit) items = items.slice(0, limit)

  const data = items.map((x: any) => ({
    slug: x.slug,
    title: x.data.title,
    date: x.data.date?.toISOString(),
    url: `/news/${x.slug}/`,
  }))
  return new Response(JSON.stringify({ count: data.length, items: data }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
