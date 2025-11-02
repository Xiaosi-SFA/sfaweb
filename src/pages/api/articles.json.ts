import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url)
  const tag = url.searchParams.get('tag')

  let items = await getCollection('articles')
  if (tag) {
    items = items.filter((x) => x.data.tags?.includes(tag))
  }
  items.sort((a, b) => (b.data.date?.valueOf() ?? 0) - (a.data.date?.valueOf() ?? 0))

  const data = items.map((x) => ({
    slug: x.slug,
    title: x.data.title,
    date: x.data.date?.toISOString(),
    author: x.data.author,
    tags: x.data.tags ?? [],
    summary: x.data.summary ?? '',
    url: `/articles/${x.slug}/`,
  }))

  return new Response(JSON.stringify({ count: data.length, items: data }), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
