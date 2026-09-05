import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeKatex from 'rehype-katex'
import rehypeCenter from './src/rehype/rehype-center.mjs'
import { defaultSchema } from 'hast-util-sanitize'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkFlexibleMarkers from 'remark-flexible-markers'
import remarkObsidian from './src/remark/remark-obsidian.mjs'

const allowedHostsFile = fileURLToPath(new URL('./allowed-hosts.txt', import.meta.url))
const allowedHosts = fs.existsSync(allowedHostsFile)
  ? fs
      .readFileSync(allowedHostsFile, 'utf-8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  : []

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://xiaosi-sfa.github.io',
  base: process.env.BASE_PATH || '/',
  redirects: {
    '/activities': '/activity/',
  },
  integrations: [tailwind({ applyBaseStyles: true })],
  markdown: {
    // Full GFM + Obsidian Markdown pipeline
    remarkPlugins: [
      remarkGfm,
      remarkMath,
      remarkFlexibleMarkers,
      remarkObsidian,
    ],
    // Support inline HTML for local typesetting & math rendering
    rehypePlugins: [
      rehypeRaw,
      rehypeCenter,
      rehypeKatex,
      [
        rehypeSanitize,
        {
          ...defaultSchema,
          tagNames: [
            ...(defaultSchema.tagNames || []),
            'center',
            'details',
            'summary',
            'mark',
            'kbd',
            'sub',
            'sup',
            'del',
            'ins',
            'ruby',
            'rt',
            'rp',
            'abbr',
            'figure',
            'figcaption',
            'svg',
            'path',
            'circle',
            'rect',
            'line',
            'polygon',
            'polyline',
            'g',
            'iframe',
            'video',
            'audio',
            'source',
            'math',
            'semantics',
            'mrow',
            'mo',
            'mn',
            'mi',
            'annotation',
          ],
          attributes: {
            ...defaultSchema.attributes,
            '*': [
              ...(defaultSchema.attributes?.['*'] || []),
              'class',
              'className',
              'style',
              'aria-hidden',
              'aria-label',
              'role',
              'tabindex',
              'title',
              'align',
              'id',
              'data-*',
            ],
            img: [
              ...(defaultSchema.attributes?.img || []),
              'src',
              'alt',
              'width',
              'height',
              'loading',
              'style',
              'class',
            ],
            a: [
              ...(defaultSchema.attributes?.a || []),
              'href',
              'target',
              'rel',
              'title',
              'class',
            ],
            details: ['open', 'class', 'style', 'data-callout'],
            summary: ['class', 'style'],
            div: ['class', 'style', 'align', 'data-callout'],
            p: ['class', 'style', 'align'],
            span: ['class', 'style', 'aria-hidden'],
            input: [
              ...(defaultSchema.attributes?.input || []),
              'type',
              'checked',
              'disabled',
            ],
            iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'class', 'style'],
            video: ['src', 'controls', 'autoplay', 'loop', 'muted', 'poster', 'width', 'height', 'class', 'style'],
            audio: ['src', 'controls', 'autoplay', 'loop', 'muted', 'class', 'style'],
          },
        },
      ],
    ],
  },
  server: {
    port: 4321,
  },
  vite: {
    server: {
      allowedHosts,
    },
    esbuild: {
      legalComments: 'none',
    },
  },
})
