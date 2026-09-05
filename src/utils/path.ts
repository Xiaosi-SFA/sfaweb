/**
 * withBase
 * 为站内绝对路径添加 Astro BASE_URL 前缀，以适配子路径（如 GitHub Pages /sfaweb/）部署。
 */
export function withBase(path: string = ''): string {
  if (!path) return ''

  // 外部链接、协议或纯锚点直接原样返回
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('//') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#') ||
    path.startsWith('javascript:') ||
    path.startsWith('data:')
  ) {
    return path
  }

  const base = import.meta.env.BASE_URL || '/'
  const cleanBase = base.endsWith('/') ? base : `${base}/`

  // 如果已经以 base 开头，避免重复添加
  if (cleanBase !== '/' && path.startsWith(cleanBase)) {
    return path
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${cleanBase}${cleanPath}`
}
