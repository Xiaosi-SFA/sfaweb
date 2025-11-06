---
title: 示例文章标题
date: 2025-11-03
author: "SFA"
tags:
  - 教程
  - 示例
  - Markdown
summary: 这是一篇用于演示本项目 Markdown 支持能力的完整模板，展示 Frontmatter 与正文中可用的全部特性。
cover: /images/sample-cover.jpg
---

> ✅ **使用说明**：复制此文件作为起点，将所有占位内容替换为实际内容。前置 Frontmatter 字段是必须遵循的结构；正文示例涵盖本项目内置的样式与交互。
>
> 📂 **主题归类**：根据文章类型放入对应文件夹：
>
> - `contributions/` — 投稿
> - `essays/` — 杂谈与随笔
> - `reviews/` — 影评 / 书评

---

## 目录与推荐联动示例

- 按 `##` `###` 构建层级，自动生成左侧目录。
- 文章 `tags` 会驱动推荐阅读侧栏。
- 摘要 `summary` 用于卡片与 SEO 描述。

### 示例子标题 A

段落支持 **粗体**、_斜体_、`行内代码`、以及带注脚的文本[^footnote-example]。

> 引用块可以嵌入其内，强调提示或引用原文。
>
> - 引用里面的列表也同样受支持。

### 示例子标题 B

#### 四级标题（用于更细粒度的目录）

这里展示无序列表和有序列表：

- 列表项一
- 列表项二
  - 嵌套列表（建议深度不超过两层）
- 列表项三

1. 有序列表第一项
2. 第二项
   1. 嵌套有序列表
3. 第三项

---

## 媒体与代码模块

### 图片

![示例图片说明文字](/images/sample-inline.jpg)

> 图片路径建议放在 `public/images/`，并在 Frontmatter 或正文中引用。

### 代码块

```ts
// TypeScript 代码示例
interface DemoProps {
  title: string
  tags?: string[]
}

const greet = (props: DemoProps) => `Hello, ${props.title}!`
console.log(greet({ title: 'Astro Content' }))
```

```bash
# Shell 代码示例
pnpm install
pnpm dev
```

<!--（已移除 GFM 表格示例）-->

<!--（已移除 GFM 扩展示例：删除线/任务列表/自动链接等）-->

<!--（已移除 LaTeX 数学公式示例）-->

---

## 提示、警示与折叠

> ℹ️ **信息提示**：可通过引用块结合 Emoji 提示关键信息。

> ⚠️ **警告提示**：请确保 Frontmatter 中的日期使用 `YYYY-MM-DD` 格式。

<!-- markdownlint-disable MD033 -->
<details>
  <summary>点击展开折叠内容</summary>
  <p>这里可以放入额外的说明，或放置长段内容。</p>
</details>
<!-- markdownlint-enable MD033 -->

---

## 链接与外部资源

- 内部链接示例：[查看更多文章](/articles/)
- 外部链接示例：[Astro 官方文档](https://docs.astro.build/)
- 引用外部媒体时，请确认已经取得授权。

---

## 数据引用（脚注）

引用资料与额外说明可以通过脚注整理[^data-source]。

---

## 常见问题（FAQ）

### Q1：Frontmatter 中的 `cover` 一定要填吗？

- 非必填。若不提供会在卡片使用备用封面背景。

### Q2：`tags` 有数量限制吗？

- 建议不超过 5 个，优先使用短标签。

---

## 发布前检查清单

- [ ] 标题、作者、日期、摘要是否准确。
- [ ] 封面图片路径是否存在。
- [ ] 目录层级是否合理，段落是否清晰。
- [ ] 代码块有无语法高亮语言标注。
- [ ] 校对拼写与链接有效性。

---

## 附录：更多 Markdown 技巧

- 使用 `---` 分隔段落生成水平线。
- `&nbsp;` 可添加空格，`<br/>` 可强制换行（谨慎使用）。
- 支持原生 HTML，适合插入自定义组件或 iframe。

[^footnote-example]: 这是一个脚注示例，可用于解释术语或补充信息。
[^data-source]: 数据来源示例，如《Astro 官方统计 2025》。



## 示例案例

<!-- HTML 测试样例：下面这些片段用于验证站点是否保留并应用作者内嵌 HTML 与内联样式 -->

<div style="text-align:center;">这是使用内联 style="text-align:center;" 的容器（应被保留并生效）。</div>

<p style="text-align:center;">这是一个带有内联样式的段落（style 在段落上）。</p>

<span style="color:#e11d48; font-weight:600">这是一段红色并加粗的内联文本（style 应被保留）。</span>

<div style="min-height:60vh; background:#f0fdf4; padding:0.5rem;">这是一个含有 <code>min-height:60vh</code> 的块级元素示例，用于测试构建产物中是否保留此类内联样式。</div>
