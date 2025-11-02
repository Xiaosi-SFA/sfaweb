import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import tailwind from '@astrojs/tailwind'

// Astro config with Node adapter to satisfy a Node.js backend preference.
export default defineConfig({
  output: 'server',
  integrations: [tailwind({ applyBaseStyles: true })],
  adapter: node({ mode: 'standalone' }),
  server: {
    port: 4321,
  },
  site: 'https://example.com',
})
