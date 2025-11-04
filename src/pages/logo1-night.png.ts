import type { APIRoute } from 'astro';

// 占位实现：将暗色版 Logo 暂时重定向到现有的 /logo1.png
// 方便后续直接替换为真实的 /public/logo1-night.png 静态资源
export const GET: APIRoute = async () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/logo1.png',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
};
