import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

function xmlEscape(s: string = ''): string {
  return s
    .split('&').join('&amp;')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('"').join('&quot;')
    .split("'").join('&#39;');
}

export const GET: APIRoute = async ({ site, url }) => {
  // Fallback site origin from request when config.site is not set (dev/preview)
  const origin = (site ?? new URL(url)).origin;

  const [articles, activity] = await Promise.all([
    getCollection('articles'),
    (getCollection as any)('activity'),
  ]);

  type Entry = {
    title: string;
    link: string;
    description?: string;
    pubDate?: Date;
  };

  const mapArticles: Entry[] = articles.map((a) => ({
    title: a.data.title,
    link: new URL(`/articles/${a.slug}/`, origin).toString(),
    description: a.data.summary,
    pubDate: a.data.date,
  }));

  const mapActivity: Entry[] = (activity as any[]).map((e: any) => ({
    title: e.data.title,
    link: new URL(`/activity/${e.slug}/`, origin).toString(),
    description: e.data.summary ?? '',
    pubDate: e.data.date,
  }));

  const items = [...mapArticles, ...mapActivity]
    .sort((a, b) => (b.pubDate?.valueOf() ?? 0) - (a.pubDate?.valueOf() ?? 0))
    .slice(0, 30);

  const now = new Date();

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SFA 社团 - RSS</title>
    <link>${origin}</link>
    <description>四川大学科幻协会（SFA）最新文章与消息。</description>
    <language>zh-CN</language>
    <lastBuildDate>${now.toUTCString()}</lastBuildDate>
    <atom:link href="${new URL('/rss.xml', origin).toString()}" rel="self" type="application/rss+xml"/>
    ${items
      .map((it) => `
    <item>
      <title>${xmlEscape(it.title)}</title>
      <link>${xmlEscape(it.link)}</link>
      <guid>${xmlEscape(it.link)}</guid>
      ${it.pubDate ? `<pubDate>${new Date(it.pubDate).toUTCString()}</pubDate>` : ''}
      ${it.description ? `<description>${xmlEscape(it.description)}</description>` : ''}
    </item>`)
      .join('')}
  </channel>
</rss>`;

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
