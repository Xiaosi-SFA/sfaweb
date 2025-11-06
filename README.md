# SFA 社团官网

使用 Astro + Tailwind 构建的社团文章与消息门户，Node 适配器提供 API 路由。

## 目标

- 存放社团产出的文章（Markdown，支持标签、作者、摘要）
- 提供消息门户（公告/更新）
- 提供 JSON API（文章、消息）便于后续小程序/飞书机器人接入

## 技术栈

- 前端：Astro 4、Tailwind CSS
- 后端：Astro Endpoint（Node 适配器）
- 内容：Astro Content Collections（`src/content`）

## 项目结构设计

```text
. 
├── astro.config.mjs                 # Astro 配置（Node 适配器 + Tailwind 集成）
├── package.json                     # 脚本与依赖
├── postcss.config.cjs               # PostCSS 配置
├── tailwind.config.cjs              # Tailwind 配置
├── tsconfig.json                    # TS 严格配置
├── public/
│   └── favicon.svg                  # 站点图标
├── src/
│   ├── content/
│   │   ├── config.ts               # 内容集合定义（articles、news）
│   │   ├── articles/               # 文章 Markdown 内容
│   │   └── news/                   # 消息 Markdown 内容
│   ├── layouts/
│   │   └── BaseLayout.astro        # 站点基础布局
│   ├── pages/
│   │   ├── index.astro             # 首页（最新消息 + 最新文章）
│   │   ├── articles/
│   │   │   ├── [slug].astro        # 文章详情页
│   │   │   └── index.astro         # 文章列表页
│   │   ├── news/
│   │   │   └── index.astro         # 消息列表页
│   │   └── api/
│   │       ├── articles.json.ts    # 文章 JSON API：/api/articles.json?tag=xxx
│   │       └── news.json.ts        # 消息 JSON API：/api/news.json?limit=20
│   └── styles/
│       └── global.css              # Tailwind 全局样式
└── .gitignore
```

## 特性开关与回滚（配置文件）

核心行为统一由配置文件管理：

- 配置文件位置：项目根目录 `sfa.config.json`
- 建议做法：提交一份标准配置到仓库（已提供默认），按环境修改后重新构建即可生效。

示例（`sfa.config.json`）：

```json
{
  "markdown": {
    "enableDialect": false
  },
  "ui": {
    "enableIndent": true
  }
}
```

字段说明：

- markdown.enableDialect：启用自定义方言（段落标记 `[flush]`、`[noindent]`、`[right]`、`[center]` 等），默认 false。
- ui.enableIndent：是否按 frontmatter 的 `indent`/`int` 恢复段首缩进，默认 true（文章页）。

说明：本项目已移除 GFM（表格/任务列表/删除线等）与 LaTeX（KaTeX）支持，保留原生 HTML 与必要的安全清洗，并在构建阶段将 `<center>` 转为可交互遮罩容器。

修改完配置文件后，执行构建即可：

```sh
pnpm build
pnpm preview
```

## 部署

- Node 运行（内置独立 server）：使用 `@astrojs/node` 适配器，`pnpm run build` 后可 `pnpm run preview` 启动。
- 静态托管也可（若不使用动态 API 路由，可改用静态适配器）。

## 后续规划

- 文章搜索与标签页
- 管理端（登录 + MD 编辑）或接入 Headless CMS
- RSS 输出（/rss.xml）

## 文章/活动详情的段首缩进配置

> 当前基线（baseline）默认不启用段首缩进，且自定义方言关闭；如需恢复，请编辑 `sfa.config.json` 中的 `ui.enableIndent` 或 `markdown.enableDialect` 并重新构建。

- 在 Markdown 前言区（frontmatter）中可通过 `indent` 字段配置段首缩进（单位：em，对段落 `<p>` 的首行生效）。
- 默认值：
  - 文章详情：`indent: 2`
  - 活动详情：`indent: 0`

- 特殊标记：将某段落首行顶格（不缩进）
  - 在段落开头加任一标记：`[flush]`、`[noindent]` 或 `【顶格】`
  - 标记会被移除，不会显示在页面上；仅该段落首行顶格，其余段落仍按 `indent` 生效。

- 特殊标记：将某段落整体右对齐（用于署名等）
  - 在段落开头加任一标记：`[right]`、`【右对齐】` 或 `【署名】`
  - 段落将 `text-align: right;`，并自动顶格（不受段首缩进影响）。

示例（文章）：

```yaml
---
title: 一篇文章
date: 2025-11-04
tags: [示例]
indent: 2 # 段首缩进 2em（可按需调整为 0/1/2/...）
---
```

示例（活动）：

```yaml
---
title: 一次活动
date: 2025-11-04
tags: [活动]
indent: 0 # 活动默认 0，也可根据需要覆盖
---
```
