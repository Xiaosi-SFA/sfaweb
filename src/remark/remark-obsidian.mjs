import { visit } from 'unist-util-visit'

/**
 * remarkObsidian
 * Unified remark plugin to support full Obsidian and GitHub Markdown dialect features:
 * 1. Obsidian Comments: %% comment %%
 * 2. Obsidian Wikilinks & Embeds: [[Note]], [[Note|Display Text]], [[Note#Section]], ![[image.png|400]]
 * 3. Obsidian Callouts & GitHub Alerts: > [!NOTE], > [!TIP], > [!WARNING], > [!INFO]+, etc.
 */

// Callout icon mapping & title formatting
const CALLOUT_TYPES = {
  note: { title: 'Note', color: 'blue' },
  info: { title: 'Info', color: 'sky' },
  todo: { title: 'Todo', color: 'cyan' },
  tip: { title: 'Tip', color: 'teal' },
  hint: { title: 'Hint', color: 'teal' },
  important: { title: 'Important', color: 'violet' },
  success: { title: 'Success', color: 'emerald' },
  check: { title: 'Check', color: 'emerald' },
  done: { title: 'Done', color: 'emerald' },
  question: { title: 'Question', color: 'amber' },
  help: { title: 'Help', color: 'amber' },
  faq: { title: 'FAQ', color: 'amber' },
  warning: { title: 'Warning', color: 'orange' },
  caution: { title: 'Caution', color: 'red' },
  attention: { title: 'Attention', color: 'red' },
  failure: { title: 'Failure', color: 'rose' },
  fail: { title: 'Fail', color: 'rose' },
  missing: { title: 'Missing', color: 'rose' },
  danger: { title: 'Danger', color: 'rose' },
  error: { title: 'Error', color: 'red' },
  bug: { title: 'Bug', color: 'red' },
  example: { title: 'Example', color: 'indigo' },
  quote: { title: 'Quote', color: 'slate' },
  cite: { title: 'Cite', color: 'slate' },
  abstract: { title: 'Abstract', color: 'teal' },
  summary: { title: 'Summary', color: 'teal' },
  tldr: { title: 'TL;DR', color: 'teal' },
}

export default function remarkObsidian() {
  return (tree) => {
    // 1. Process Obsidian Comments & Wikilinks in text nodes
    visit(tree, 'text', (node, index, parent) => {
      if (!node.value || !parent || typeof index !== 'number') return

      let val = node.value

      // 1.1 Remove inline/multiline Obsidian comments %% ... %%
      if (val.includes('%%')) {
        val = val.replace(/%%[\s\S]*?%%/g, '')
        node.value = val
      }

      // 1.2 Check for WikiLinks: ![[embed]] or [[link]]
      const wikiRegex = /(!)?\[\[([^\]|#]+)(?:#([^\]|]+))?(?:\|([^\]]+))?\]\]/g
      if (!wikiRegex.test(val)) return

      wikiRegex.lastIndex = 0
      const newChildren = []
      let lastIndex = 0
      let match

      while ((match = wikiRegex.exec(val)) !== null) {
        const [fullMatch, isEmbed, target, section, alias] = match
        const matchStart = match.index
        const matchEnd = wikiRegex.lastIndex

        // Text before match
        if (matchStart > lastIndex) {
          newChildren.push({
            type: 'text',
            value: val.slice(lastIndex, matchStart),
          })
        }

        const cleanTarget = target.trim()
        const cleanSection = section ? '#' + section.trim() : ''
        const displayText = alias ? alias.trim() : section ? `${cleanTarget} > ${section.trim()}` : cleanTarget

        if (isEmbed) {
          // Embed image or media
          const isRemote = cleanTarget.startsWith('http://') || cleanTarget.startsWith('https://') || cleanTarget.startsWith('/')
          const imgSrc = isRemote ? cleanTarget : `/images/${cleanTarget}`
          const sizeAttr = alias ? alias.trim() : undefined

          newChildren.push({
            type: 'image',
            url: imgSrc,
            alt: cleanTarget,
            title: sizeAttr || null,
            data: {
              hProperties: sizeAttr ? { style: `width: ${sizeAttr}px; max-width: 100%;` } : {},
            },
          })
        } else {
          // WikiLink to internal article / page
          let href = cleanTarget
          if (!href.startsWith('http') && !href.startsWith('/')) {
            // Slugify link
            href = `/articles/${encodeURIComponent(cleanTarget.toLowerCase())}/${cleanSection}`
          } else {
            href = `${href}${cleanSection}`
          }

          newChildren.push({
            type: 'link',
            url: href,
            children: [{ type: 'text', value: displayText }],
          })
        }

        lastIndex = matchEnd
      }

      if (lastIndex < val.length) {
        newChildren.push({
          type: 'text',
          value: val.slice(lastIndex),
        })
      }

      // Replace the text node with new children
      if (newChildren.length > 0) {
        parent.children.splice(index, 1, ...newChildren)
        return index + newChildren.length
      }
    })

    // 2. Process Obsidian Callouts & GitHub Alerts in blockquotes
    visit(tree, 'blockquote', (node) => {
      if (!node.children || node.children.length === 0) return

      const firstChild = node.children[0]
      if (firstChild.type !== 'paragraph' || !firstChild.children || firstChild.children.length === 0) return

      const firstTextNode = firstChild.children[0]
      if (firstTextNode.type !== 'text' || !firstTextNode.value) return

      // Match: [!TYPE] or [!TYPE]+ or [!TYPE]- Optional Title
      const calloutMatch = firstTextNode.value.match(/^\[!([a-zA-Z_-]+)\]([+-])?(?:[ \t]+(.*))?/)
      if (!calloutMatch) return

      const rawType = calloutMatch[1].toLowerCase()
      const foldMode = calloutMatch[2] // '+' = open, '-' = collapsed, undefined = normal
      const customTitle = calloutMatch[3]?.trim()

      const typeMeta = CALLOUT_TYPES[rawType] || { title: rawType.toUpperCase(), color: 'slate' }
      const displayTitle = customTitle || typeMeta.title

      // Strip the [!TYPE] line from paragraph
      firstTextNode.value = firstTextNode.value.replace(/^\[!([a-zA-Z_-]+)\]([+-])?(?:[ \t]+(.*))?(?:\r?\n|$)/, '')

      // If first text node is empty, remove it
      if (!firstTextNode.value.trim()) {
        firstChild.children.shift()
      }

      // If first paragraph is now completely empty, remove it
      if (firstChild.children.length === 0) {
        node.children.shift()
      }

      // Build callout title AST element
      const titleElement = {
        type: 'paragraph',
        data: {
          hName: foldMode ? 'summary' : 'div',
          hProperties: {
            className: ['callout-title', `callout-title-${rawType}`],
          },
        },
        children: [
          {
            type: 'html',
            value: `<span class="callout-icon" aria-hidden="true"></span>`,
          },
          {
            type: 'text',
            value: displayTitle,
          },
        ],
      }

      // Convert blockquote to callout div or details
      const isFoldable = Boolean(foldMode)
      node.data = node.data || {}
      node.data.hName = isFoldable ? 'details' : 'div'
      node.data.hProperties = {
        className: ['callout', `callout-${rawType}`, `callout-color-${typeMeta.color}`, isFoldable ? 'callout-foldable' : ''],
        'data-callout': rawType,
        ...(foldMode === '+' ? { open: true } : {}),
      }

      // Prepend title element
      node.children.unshift(titleElement)
    })
  }
}
