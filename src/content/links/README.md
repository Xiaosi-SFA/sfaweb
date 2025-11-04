# 友链使用说明

友链通过 Markdown 前言区（frontmatter）进行配置，文件放在 `src/content/links/` 下，每个文件代表一个友链。

示例（`src/content/links/some-site.md`）:

---
title: 某某站点
url: https://example.com/
description: 这里是一句对站点的简短介绍。
# logo 支持两种方式：
# 1) 远程图片 URL（推荐 CDN）
# logo: https://cdn.example.com/logo.png
# 2) 本地静态资源（放在 public/ 下），用绝对路径引用
logo: /images/some-site-logo.png
---

说明：
- `title`：显示名称。
- `url`：点击跳转地址。
- `description`：简短描述。
- `logo`：
  - 远程地址：填完整 `https://...`。
  - 本地图片：将图片放到 `public/`（例如 `public/images/...`），前面以 `/` 开头引用（如 `/images/logo.png`）。

注意：
- `src/content/` 目录下的文件不会直接对外暴露，不能用相对路径（如 `./logo.png`）引用这里的图片，请放入 `public/` 后以绝对路径引用。
- 没有 `logo` 字段时，页面会显示“ No Logo ”占位。