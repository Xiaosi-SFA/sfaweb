// remark plugin: mark paragraphs that start with a special marker as no-indent
// Supported markers: [flush], [noindent], 【顶格】
export default function remarkNoIndent(options = {}) {
  const noIndentMarkers = (options.noIndentMarkers || ['[flush]', '[noindent]', '【顶格】']).map(String);
  const rightAlignMarkers = (options.rightAlignMarkers || ['[right]', '【右对齐】', '【署名】']).map(String);
  const centerAlignMarkers = (options.centerAlignMarkers || ['[center]', '【居中】']).map(String);
  const asciiMarkerLabels = new Set(['flush', 'noindent', 'right', 'center']);

  return function transformer(tree) {
    function applyMarkerClass(node, className) {
      node.data = node.data || {};
      node.data.hProperties = node.data.hProperties || {};
      const existing = node.data.hProperties.className;
      if (Array.isArray(existing)) {
        if (!existing.includes(className)) existing.push(className);
      } else if (typeof existing === 'string') {
        node.data.hProperties.className = existing ? existing + ' ' + className : className;
      } else {
        node.data.hProperties.className = className;
      }
    }

    function handleParagraph(node) {
      let first = node.children?.[0];
      if (!first) return;

      // 可能存在多个标记，循环剥离；容忍前导空白与大小写（仅对方括号指令）
      let changed = true;
      while (changed) {
        changed = false;

        // 1) 纯文本起始的标记（如：[right]、【顶格】）
        if (first && first.type === 'text' && typeof first.value === 'string') {
          const text = first.value;
          const wsLen = text.length - text.trimStart().length;
          const at = (m) => {
            const lower = text.toLowerCase();
            const ml = m.toLowerCase();
            if (lower.startsWith(ml, wsLen)) return wsLen;
            if (text.startsWith(m)) return 0;
            return -1;
          };
          const n = noIndentMarkers.find((m) => at(m) >= 0);
          if (n) {
            const pos = at(n);
            first.value = text.slice(pos + n.length).replace(/^[\s\u3000]+/, '');
            applyMarkerClass(node, 'no-indent');
            changed = true;
            continue;
          }
          const r = rightAlignMarkers.find((m) => at(m) >= 0);
          if (r) {
            const pos = at(r);
            first.value = text.slice(pos + r.length).replace(/^[\s\u3000]+/, '');
            applyMarkerClass(node, 'align-right');
            applyMarkerClass(node, 'no-indent');
            changed = true;
            continue;
          }
          const c = centerAlignMarkers.find((m) => at(m) >= 0);
          if (c) {
            const pos = at(c);
            first.value = text.slice(pos + c.length).replace(/^[\s\u3000]+/, '');
            applyMarkerClass(node, 'align-center');
            applyMarkerClass(node, 'no-indent');
            changed = true;
            continue;
          }
        }

        // 2) 链接引用形式的标记（如：[right] 被解析为 linkReference）
        if (first && first.type === 'linkReference' && typeof first.label === 'string') {
          const label = first.label.toLowerCase();
          if (asciiMarkerLabels.has(label)) {
            // 删除开头的引用节点
            node.children.shift();
            // 去掉紧随文本的前导空白
            const next = node.children?.[0];
            if (next && next.type === 'text' && typeof next.value === 'string') {
              next.value = next.value.replace(/^[\s\u3000]+/, '');
            }
            if (label === 'flush' || label === 'noindent') {
              applyMarkerClass(node, 'no-indent');
            }
            if (label === 'right') {
              applyMarkerClass(node, 'align-right');
              applyMarkerClass(node, 'no-indent');
            }
            if (label === 'center') {
              applyMarkerClass(node, 'align-center');
              applyMarkerClass(node, 'no-indent');
            }
            changed = true;
            first = node.children?.[0];
            continue;
          }
        }
      }
    }

    function walk(node) {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'paragraph') { handleParagraph(node); }
      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          walk(child);
        }
      }
    }
    walk(tree);
  };
}
