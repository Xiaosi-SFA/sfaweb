// rehype plugin: convert <center> elements to <div class="text-center"> so
// Tailwind/Prose styles apply consistently.
export default function rehypeCenterToDiv() {
  // Default behaviour: convert <center> elements into classed containers so
  // site CSS (and the preview mask) can target them. Other inline HTML is
  // preserved unchanged.
  //
  // Note: this plugin only transforms the `center` tag. It adds a
  // `center-preview` marker class so the frontend CSS can render a black/white
  // mask that reveals the inner text on hover.
  return (tree) => {
    // simple recursive walk
    const visit = (node) => {
      if (!node || typeof node !== 'object') return
      if (node.type === 'element' && node.tagName === 'center') {
        const props = node.properties || (node.properties = {})
        // Decide whether to convert to a <p class="align-center"> if the
        // contents are purely inline/text, otherwise use a block-level
        // <div class="text-center"> with inline style fallback.
        const inlineTags = new Set(['a', 'strong', 'em', 'span', 'code', 'br', 'kbd', 'sub', 'sup', 'small', 'b', 'i', 'u'])
        const children = node.children || []
        const allInline = children.every((c) => {
          if (c.type === 'text') return true
          if (c.type === 'element') return inlineTags.has(c.tagName)
          return false
        })

        if (allInline) {
          node.tagName = 'p'
          // add align-center + center-preview classes used by article CSS
          const classes = [...(props.className || []), 'align-center', 'center-preview']
          props.className = classes
          if (props.class) props.class = `${props.class} align-center center-preview`
          // insert a mask element as first child so CSS can cover the content
          const mask = { type: 'element', tagName: 'div', properties: { className: ['mask'] }, children: [] }
          node.children = [mask, ...(node.children || [])]
        } else {
          node.tagName = 'div'
          // add text-center + center-preview so block-level centers are targetable
          const classes = [...(props.className || []), 'text-center', 'center-preview']
          props.className = classes
          if (props.class) props.class = `${props.class} text-center center-preview`
          const mask = { type: 'element', tagName: 'div', properties: { className: ['mask'] }, children: [] }
          node.children = [mask, ...(node.children || [])]
        }
      }
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) visit(child)
      }
    }

    visit(tree)
  }
}
