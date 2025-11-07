import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import tailwind from '@astrojs/tailwind'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeCenter from './src/rehype/rehype-center.mjs'
import { defaultSchema } from 'hast-util-sanitize'
import remarkGfm from 'remark-gfm'
import remarkNoIndent from './src/remark/noindent.mjs'
import siteConfig from './sfa.config.json' assert { type: 'json' }
 

const allowedHostsFile = fileURLToPath(new URL('./allowed-hosts.txt', import.meta.url))
const allowedHosts = fs.existsSync(allowedHostsFile)
  ? fs
      .readFileSync(allowedHostsFile, 'utf-8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  : []

// Astro config with Node adapter to satisfy a Node.js backend preference.
// ----- Feature flags (config file) -----
const ENABLE_DIALECT = Boolean(siteConfig?.markdown?.enableDialect)

export default defineConfig({
  output: 'server',
  integrations: [tailwind({ applyBaseStyles: true })],
  adapter: node({ mode: 'standalone' }),
  markdown: {
    // Build remarkPlugins based on feature flags (GFM/LaTeX removed)
    remarkPlugins: [
      // Enable GitHub Flavored Markdown (tables, task lists, strikethrough, autolinks)
      remarkGfm,
      ...(ENABLE_DIALECT ? [remarkNoIndent] : []),
    ],
    // allow inline/raw HTML in markdown content but sanitize it to avoid XSS
    // Extend the default sanitize schema to allow a small set of additional
    // tags/attributes authors may reasonably use (e.g. <center>, class/style).
    // We spread the defaultSchema so we keep the conservative defaults and
    // only add what we need.
    // Process inline HTML, convert <center> to a div.text-center, then
    // sanitize the final tree.
    // Order: parse raw HTML -> custom transforms -> sanitize
    rehypePlugins: [
      rehypeRaw,
      // Convert legacy <center> tags into a styled div, then sanitize
      rehypeCenter,
      [
        rehypeSanitize,
        {
          ...defaultSchema,
          // Keep minimal safe allowances for class/style used by our transforms/content
          attributes: {
            ...defaultSchema.attributes,
            '*': [
              ...(defaultSchema.attributes?.['*'] || []),
              'class',
              'style',
              'aria-hidden',
              'role',
              'tabindex',
              'title',
            ],
            // Allow limited attributes for GFM task list checkboxes
            input: [
              ...(defaultSchema.attributes?.input || []),
              'type',
              'checked',
              'disabled',
            ],
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
    // 构建产物去除注释：
    // - JS：通过 esbuild 设置 legalComments: 'none'，移除所有注释（含 license banner）。
    // - CSS：通过 PostCSS(cssnano) 在生产环境移除注释（见 postcss.config.cjs）。
    esbuild: {
      legalComments: 'none',
    },
  },
  site: 'https://example.com',
})
