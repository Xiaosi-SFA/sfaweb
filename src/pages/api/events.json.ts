import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const limitParam = url.searchParams.get('limit')
  const limit = limitParam ? Math.max(1, Math.min(100, Number.parseInt(limitParam))) : undefined

  const events = await (getCollection as any)('events') as any[]
  const groups = await getCollection('groups')
  const depts = await getCollection('departments')
  const groupMap = new Map(groups.map((g) => [g.slug, g.data.title]))
  const deptMap = new Map(depts.map((d) => [d.slug, d.data.title]))

  const hostName = (e: any) => {
    if (e.data.hostType === 'group' && e.data.hostSlug) return groupMap.get(e.data.hostSlug) ?? e.data.hostSlug
    if (e.data.hostType === 'department' && e.data.hostSlug) return deptMap.get(e.data.hostSlug) ?? e.data.hostSlug
    return undefined
  }

  const sorted = [...events].sort((a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0))
  let items = sorted
  if (limit) items = items.slice(0, limit)

  const data = items.map((x) => ({
    slug: x.slug,
    title: x.data.title,
    date: x.data.date?.toISOString(),
    summary: x.data.summary,
    cover: x.data.cover,
    hostType: x.data.hostType,
    hostSlug: x.data.hostSlug,
    host: hostName(x),
    url: `/events/${x.slug}/`,
  }))

  return new Response(JSON.stringify({ count: data.length, items: data }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
