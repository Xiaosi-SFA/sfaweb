import type { APIRoute } from 'astro'

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({
    message: 'The news API has been removed. Please use /api/events.json instead.'
  }), {
    status: 410,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  })
}
