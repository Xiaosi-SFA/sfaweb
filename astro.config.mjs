import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import tailwind from '@astrojs/tailwind'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

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
