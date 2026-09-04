import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeCenter from './src/rehype/rehype-center.mjs'
import { defaultSchema } from 'hast-util-sanitize'
import remarkGfm from 'remark-gfm'
import remarkNoIndent from './src/remark/noindent.mjs'

const siteConfigFile = fileURLToPath(new URL('./sfa.config.json', import.meta.url))
const siteConfig = fs.existsSync(siteConfigFile)
  ? JSON.parse(fs.readFileSync(siteConfigFile, 'utf-8'))
  : {}

const allowedHostsFile = fileURLToPath(new URL('./allowed-hosts.txt', import.meta.url))
const allowedHosts = fs.existsSync(allowedHostsFile)
  ? fs
      .readFileSync(allowedHostsFile, 'utf-8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  : []

// ----- Feature flags (config file) -----
const ENABLE_DIALECT = Boolean(siteConfig?.markdown?.enableDialect)

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || 'https://visio-vanitas.github.io',
  base: process.env.BASE_PATH || '/',
  redirects: {
    '/activities': '/activity/',
  },
  integrations: [tailwind({ applyBaseStyles: true })],
  markdown: {
    // Build remarkPlugins based on feature flags
    remarkPlugins: [
      remarkGfm,
      ...(ENABLE_DIALECT ? [remarkNoIndent] : []),
    ],
    // allow inline/raw HTML in markdown content but sanitize it to avoid XSS
    rehypePlugins: [
      rehypeRaw,
      rehypeCenter,
      [
        rehypeSanitize,
        {
          ...defaultSchema,
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
    esbuild: {
      legalComments: 'none',
    },
  },
})
