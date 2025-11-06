import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import tailwind from '@astrojs/tailwind'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import remarkNoIndent from './src/remark/noindent.mjs'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { defaultSchema } from 'hast-util-sanitize'
import rehypeCenterToDiv from './src/rehype/center-to-div.mjs'

const allowedHostsFile = fileURLToPath(new URL('./allowed-hosts.txt', import.meta.url))
const allowedHosts = fs.existsSync(allowedHostsFile)
  ? fs
      .readFileSync(allowedHostsFile, 'utf-8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
  : []

// Astro config with Node adapter to satisfy a Node.js backend preference.
export default defineConfig({
  output: 'server',
  integrations: [tailwind({ applyBaseStyles: true })],
  adapter: node({ mode: 'standalone' }),
  markdown: {
    remarkPlugins: [remarkNoIndent],
    // allow inline/raw HTML in markdown content but sanitize it to avoid XSS
    // Extend the default sanitize schema to allow a small set of additional
    // tags/attributes authors may reasonably use (e.g. <center>, class/style).
    // We spread the defaultSchema so we keep the conservative defaults and
    // only add what we need.
    // Process inline HTML, convert <center> to a div.text-center, then
    // sanitize the final tree.
    rehypePlugins: [rehypeRaw, rehypeCenterToDiv, [rehypeSanitize, {
      ...defaultSchema,
      // ensure div is allowed and only allow `class` (not `style`) broadly.
      // Keeping `style` out of global allowance is more secure; we prefer
      // using Tailwind classes (`text-center` / `align-center`) instead.
      tagNames: [...(defaultSchema.tagNames || []), 'div'],
      attributes: {
        ...defaultSchema.attributes,
        // allow class and style on any element so editorial team can use
        // inline styles when they review content. This relaxes the sanitize
        // policy and increases XSS surface; ensure editorial review and
        // optional automated checks are in place before enabling widely.
        '*': [...(defaultSchema.attributes?.['*'] || []), 'class', 'style'],
      },
    }]],
  },
  server: {
    port: 4321,
  },
  vite: {
    server: {
      allowedHosts,
    },
  },
  site: 'https://example.com',
})
