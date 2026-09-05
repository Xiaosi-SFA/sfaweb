---
title: SFA Web 高级排版与 Markdown 渲染技术手册
date: 2026-09-05
author: "@Visio-Vanitas,Gemini"
tags: [排版规范, Markdown, Obsidian, LaTeX, 前端指南]
summary: 阐述 SFA Web 渲染管线支持的高级排版语法，包括 Obsidian Callouts、KaTeX 数学公式、行内标记、内部链接、段落对齐及 HTML 扩展组件规范。
indent: 0
align: left
---

> [!NOTE] 说明
> 本文档说明 SFA Web 渲染管线所支持的语法扩展与排版规范。管线由 GFM、Remark 扩展插件、KaTeX 公式引擎及 Rehype HTML 净化层组合构成，所有扩展语法均在编译阶段静态解析。

---

## 一、Obsidian Callouts（呼出框）

渲染管线内置针对引用块的 AST 转换插件（`src/remark/remark-obsidian.mjs`）。在标准 Blockquote 首行添加 `[!TYPE]` 标识即可转换为带样式的 Callout 容器。

### 1. 基础语法

```markdown
> [!NOTE]
> 这是默认标题的说明卡片。

> [!TIP] 自定义标题文本
> 类型标识后紧跟空格可自定义卡片标题。
```

### 2. 支持的语义类型与色彩映射

系统定义了 6 组主色调，共支持 25 个关键字，各主题在暗色与浅色模式下均已适配对比度：

| 色系 | 支持类型 | 适用场景 |
| :--- | :--- | :--- |
| **蓝色系** | `NOTE`, `INFO`, `TODO` | 背景说明、补充信息、待办事项 |
| **绿色系** | `TIP`, `HINT`, `SUCCESS`, `CHECK`, `DONE`, `ABSTRACT`, `SUMMARY`, `TLDR` | 技巧提示、操作成功、总结摘要 |
| **紫色系** | `IMPORTANT`, `EXAMPLE` | 重点声明、典型范例 |
| **橙黄系** | `WARNING`, `QUESTION`, `HELP`, `FAQ` | 注意事项、疑问解答、常见问题 |
| **红色系** | `CAUTION`, `ATTENTION`, `DANGER`, `ERROR`, `BUG`, `FAILURE`, `FAIL`, `MISSING` | 严重警告、危险操作、故障记录 |
| **灰色系** | `QUOTE`, `CITE` | 文献引用、引语摘录 |

#### 常用类型渲染示例

> [!NOTE] 设定记录
> 用于展示设定背景、技术参数或客观陈述。

> [!TIP] 实用技巧
> 用于给出针对性提示或操作指导。

> [!IMPORTANT] 核心原则
> 用于强调不可忽略的关键约束条件。

> [!WARNING] 注意事项
> 用于指出潜在风险或逻辑例外情况。

> [!CAUTION] 风险警示
> 用于标识高危操作或严重破坏性后果。

> [!QUOTE] 引文出处
> 用于引用第三方文献、规范条文或名家语录。

---

### 3. 可折叠面板语法

在类型后追加 `+` 或 `-` 可将卡片转换为 HTML5 原生 `<details>` 折叠容器：

- **`-` 默认折叠（适用于长篇设定集或防剧透内容）**：
  ```markdown
  > [!FAQ]- 点击展开详细推导过程
  > 折叠内容仅在用户点击标题后展示。
  ```
  **实际渲染**：
  > [!FAQ]- 点击展开详细推导过程
  > 折叠内容仅在用户点击标题后展示。

- **`+` 默认展开（允许用户手动收起）**：
  ```markdown
  > [!INFO]+ 系统初始化参数列表
  > 默认显示内容，用户点击标题后可折叠。
  ```

---

## 二、LaTeX / KaTeX 数学与物理公式

公式通过 `remark-math` 与 `rehype-katex` 在构建时直接编译为 HTML 与 MathML，不依赖客户端 JavaScript 运行时。

### 1. 行内公式（Inline）
使用单个 `$` 包裹：
```markdown
质能方程为 $E = mc^2$，薛定谔方程为 $i\hbar \frac{\partial}{\partial t}\Psi = \hat{H}\Psi$。
```
**实际渲染**：
质能方程为 $E = mc^2$，薛定谔方程为 $i\hbar \frac{\partial}{\partial t}\Psi = \hat{H}\Psi$。

### 2. 块级独立公式（Block）
使用双 `$$` 独立成段：
```markdown
$$
\oint_{\partial \Omega} \mathbf{E} \cdot d\mathbf{S} = \frac{1}{\varepsilon_0} \iiint_{\Omega} \rho \, dV
$$
```
**实际渲染**：
$$
\oint_{\partial \Omega} \mathbf{E} \cdot d\mathbf{S} = \frac{1}{\varepsilon_0} \iiint_{\Omega} \rho \, dV
$$

### 3. 多行方程组
支持 `aligned`、`matrix`、`cases` 等标准环境：
```markdown
$$
\begin{cases}
x(t) = r(t) \cos \theta(t) \\
y(t) = r(t) \sin \theta(t)
\end{cases}
$$
```
**实际渲染**：
$$
\begin{cases}
x(t) = r(t) \cos \theta(t) \\
y(t) = r(t) \sin \theta(t)
\end{cases}
$$

---

## 三、行内标记与批注

### 1. 文本高亮
使用双等号 `==文本==` 包裹（经由 `remark-flexible-markers` 解析），渲染为 `<mark>` 标签：
```markdown
实验数据显示，==临界跃迁阈值为 1.414==。
```
**实际渲染**：
实验数据显示，==临界跃迁阈值为 1.414==。

### 2. 源码私有批注
使用 `%%` 包裹注释内容。该内容由 Remark 插件在 AST 阶段剔除，不会输出至最终 HTML 文件中：
```markdown
公开文字部分。%% 此处为未定稿批注，客户端不生成对应 DOM %% 后续公开文字。
```

### 3. 内部双向链接（WikiLinks）
- `[[contribution-guide]]`：自动解析为同栏目文章链接。
- `[[contribution-guide|内容提交指南]]`：使用自定义显示文本。

---

## 四、排版对齐与缩进控制

### 1. 段首缩进控制
- 文章 Frontmatter 中指定 `indent: 2` 时，全局段落应用 `text-indent: 2em`。
- 单独段落取消缩进：使用带有 `no-indent` 类名的 `<p>` 标签：
  ```html
  <p class="no-indent">本段取消段首缩进，常用于诗歌或首段题记。</p>
  ```

### 2. 局部排版对齐
渲染管线包含 `rehype-center` 插件，支持快捷对齐标签：
```html
<center>

### 文本居中标题

居中说明段落

</center>

<right>右对齐落款</right>
```

**实际渲染**：
<center>

### 文本居中标题

居中说明段落

</center>

<right>右对齐落款</right>

---

## 五、HTML 扩展组件规范

Astro 开启了 `rehype-raw` 与安全的属性白名单消毒处理，允许混用以下语义标签：

### 1. 键盘按键（`<kbd>`）
```html
使用 <kbd>Ctrl</kbd> + <kbd>F</kbd> 执行全文检索。
```
**实际渲染**：
使用 <kbd>Ctrl</kbd> + <kbd>F</kbd> 执行全文检索。

### 2. 汉字注音与旁注（`<ruby>`）
```html
<ruby>超光速<rt>FTL</rt></ruby>与<ruby>曲率驱动<rt>Warp Drive</rt></ruby>
```
**实际渲染**：
<ruby>超光速<rt>FTL</rt></ruby>与<ruby>曲率驱动<rt>Warp Drive</rt></ruby>

### 3. 多媒体嵌入（`<iframe>`）
嵌入外部视频播放器时，添加 `class="w-full aspect-video rounded-xl my-4"` 确保响应式比例：
```html
<iframe src="//player.bilibili.com/player.html?bvid=BV1xx411c7mD&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="w-full aspect-video rounded-xl my-4"></iframe>
```

---

## 六、样式兼容与编写建议

1. **避免硬编码颜色**：不要在 Markdown 标签中使用固定内联色值（如 `style="color: black;"`），这会破坏暗色模式下的阅读可读性。
2. **长内容与表格溢出**：表格（`<table>`）与行内代码块（`<pre>`）容器自带横向滚动（`overflow-x: auto`），在移动端不会造成页面横向撑破。
3. **内容提交流程**：撰写完成的文档请遵循投稿指引发起 PR：
   👉 **[[contribution-guide|SFA 官方网站投稿与内容共建全指南]]**。
