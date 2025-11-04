import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

export const GET: APIRoute = async () => {
  const entries = (await (getCollection as any)('about')) as any[]
  const about = entries.find((x) => x.slug === 'index')

  if (!about) {
    return new Response(JSON.stringify({ error: 'About content not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    })
  }

  const data = {
    title: about.data.title,
    intro: about.data.intro ?? null,
    updated: about.data.updated ? new Date(about.data.updated).toISOString() : null,
    slug: about.slug,
    // 提供原始 Markdown 以便客户端自行渲染；避免在服务端拼 HTML 带来风格耦合
    body: about.body ?? null,
  }

  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
