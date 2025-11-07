import { visit } from 'unist-util-visit'

export default function rehypeCenter() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName && node.tagName.toLowerCase() === 'center') {
        // Convert <center> to <div style="text-align:center;"> so styles apply
        node.tagName = 'div'
        node.properties = node.properties || {}
        // preserve existing style but ensure text-align:center is applied
        const existingStyle = node.properties.style || node.properties['style'] || ''
        // normalize to string and append text-align if not present
        const styleStr = String(existingStyle).trim()
        const hasTextAlign = /text-align\s*:/i.test(styleStr)
        if (hasTextAlign) {
          node.properties.style = styleStr
        } else {
          const sep = styleStr && !styleStr.endsWith(';') ? ';' : ''
          node.properties.style = `${styleStr}${sep}text-align:center;`
        }
        // remove legacy class prop if present (we're using inline style for center)
        if (node.properties.class) delete node.properties.class
        if (node.properties.className) delete node.properties.className
      }
    })
  }
}
