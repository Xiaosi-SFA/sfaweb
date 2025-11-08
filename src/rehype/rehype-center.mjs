import { visit } from 'unist-util-visit'

export default function rehypeCenter() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName && ['center', 'left', 'right'].includes(node.tagName.toLowerCase())) {
        // Convert <center>/<left>/<right> to <div style="text-align:...;"> so styles apply
        const tag = node.tagName.toLowerCase()
        const alignVal = tag === 'left' ? 'left' : tag === 'right' ? 'right' : 'center'
        node.tagName = 'div'
        node.properties = node.properties || {}
        // preserve existing style but ensure text-align is applied
        const existingStyle = node.properties.style || node.properties['style'] || ''
        const styleStr = String(existingStyle).trim()
        const hasTextAlign = /text-align\s*:/i.test(styleStr)
        if (hasTextAlign) {
          node.properties.style = styleStr
        } else {
          const sep = styleStr && !styleStr.endsWith(';') ? ';' : ''
          node.properties.style = `${styleStr}${sep}text-align:${alignVal};`
        }
        // remove legacy class prop if present to avoid conflicting semantics
        if (node.properties.class) delete node.properties.class
        if (node.properties.className) delete node.properties.className
      }
    })
  }
}
