import { visit } from 'unist-util-visit'

export default function rehypeBase() {
  const base = process.env.BASE_PATH || '/'
  const cleanBase = base.endsWith('/') ? base : `${base}/`

  return (tree) => {
    if (cleanBase === '/') return

    visit(tree, 'element', (node) => {
      if (!node.properties) return

      if (node.tagName === 'a' && typeof node.properties.href === 'string') {
        const href = node.properties.href.trim()
        if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith(cleanBase)) {
          node.properties.href = `${cleanBase}${href.slice(1)}`
        }
      }

      if (node.tagName === 'img' && typeof node.properties.src === 'string') {
        const src = node.properties.src.trim()
        if (src.startsWith('/') && !src.startsWith('//') && !src.startsWith(cleanBase)) {
          node.properties.src = `${cleanBase}${src.slice(1)}`
        }
      }

      if (['video', 'audio', 'iframe', 'source'].includes(node.tagName) && typeof node.properties.src === 'string') {
        const src = node.properties.src.trim()
        if (src.startsWith('/') && !src.startsWith('//') && !src.startsWith(cleanBase)) {
          node.properties.src = `${cleanBase}${src.slice(1)}`
        }
      }
    })
  }
}
