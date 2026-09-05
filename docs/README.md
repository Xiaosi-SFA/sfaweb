# 四川大学科幻协会（SFA Web）投稿与内容排版指南

欢迎向四川大学科幻协会（SFA）官方网站投稿！本指南将详细介绍如何在网站中增添**文章**、**活动记录**与**兴趣小组**，并提供基础 Markdown 格式规范与高级排版技巧，帮助你呈现优美、专业的阅读体验。

---

## 目录

- [一、投稿快速流程](#一投稿快速流程)
- [二、三大内容类型规范与模板](#二三大内容类型规范与模板)
  - [1. 文章投稿（Articles）](#1-文章投稿articles)
  - [2. 活动纪实（Activity）](#2-活动纪实activity)
  - [3. 兴趣小组（Groups）](#3-兴趣小组groups)
- [三、图片与多媒体素材管理](#三图片与多媒体素材管理)
- [四、Markdown 高级排版手册](#四markdown-高级排版手册)
  - [1. Obsidian 呼出框（Callouts）与折叠面板](#1-obsidian-呼出框callouts与折叠面板)
  - [2. LaTeX / KaTeX 数学公式](#2-latex--katex-数学公式)
  - [3. 荧光笔高亮与 Obsidian 注释](#3-荧光笔高亮与-obsidian-注释)
  - [4. 双向链接（WikiLinks）与内嵌语法](#4-双向链接wikilinks与内嵌语法)
  - [5. 段首缩进与对齐控制](#5-段首缩进与对齐控制)
  - [6. HTML 扩展排版标签（快捷键、注音、折叠）](#6-html-扩展排版标签快捷键注音折叠)
- [五、本地预览与提交检查清单](#五本地预览与提交检查清单)

---

## 一、投稿快速流程

本站点基于 GitHub 工作流运作，任何人均可通过 Pull Request（PR）贡献内容：

1. **Fork 仓库**：在 GitHub 上将 [Xiaosi-SFA/sfaweb](https://github.com/Xiaosi-SFA/sfaweb) Fork 到你的个人账号。
2. **切出分支**：基于 **`dev`** 分支创建你的内容分支（例如 `content/my-new-article`）。
3. **添加文件**：根据内容类型在 `src/content/` 对应子目录中创建 `.md` 文件，并填写头部元数据（Frontmatter）与正文。
4. **本地预览**：运行 `pnpm dev` 打开 `http://localhost:4321` 确认排版与视效无误。
5. **提交 PR**：将修改推送到个人 Fork 仓库，并发起指向官方仓库 **`dev`** 分支的 Pull Request。

---

## 二、三大内容类型规范与模板

所有内容文件均使用 Markdown 格式（`.md`），头部必须包含由三道短横线 `---` 包裹的 YAML 元数据（Frontmatter）。

### 1. 文章投稿（Articles）

* **存放路径**：`src/content/articles/{分类}/{文件名}.md`
* **可选分类目录**：
  * `classics`：科幻名篇 / 经典选读
  * `contributions`：社员及读者原创科幻小说 / 诗歌投稿
  * `essays`：科幻随笔 / 科普杂谈 / 漫谈
  * `reviews`：科幻影视 / 书籍 / 游戏深度评析
* **URL 映射规则**：`articles/{分类}/{文件名}/`

#### Frontmatter 字段说明

| 字段 | 类型 | 是否必填 | 默认值 | 说明 |
| :--- | :--- | :---: | :--- | :--- |
| `title` | `string` | **必填** | - | 文章主标题 |
| `date` | `YYYY-MM-DD` | **必填** | - | 发布或撰写日期 |
| `author` | `string` | 选填 | `SFA` | 作者署名（支持网名或实名） |
| `tags` | `string[]` | 选填 | `[]` | 标签列表，用于检索与推荐关联 |
| `summary` | `string` | 选填 | 自动提取 | 卡片摘要（建议 100~200 字，上限 280） |
| `cover` | `string` | 选填 | 空 | 封面图片路径（支持本地 `/images/...` 或外部 URL） |
| `indent` | `number` | 选填 | `2` | 段首缩进字符数（默认 2 个中文字符宽） |
| `align` | `string` | 选填 | `left` | 默认对齐方式（`left` / `center` / `right`） |

#### 文章模板范例

```markdown
---
title: 最后的观测者与逆熵之海
date: 2026-09-05
author: 探索者四号
tags: [小说, 硬科幻, 征文投稿]
summary: 当宇宙微波背景辐射归于绝对零度，观测站的指示灯亮起了最后一次红芒。
cover: /images/articles/observer.jpg
indent: 2
align: left
---

在空间站坠向视界的前三秒，陈墨终于确认了那个信号的频率。

这不是引力波的杂音，而是一段来自热寂终点的逆熵序曲。

## 第一章 遗失的坐标

星际跃迁引擎的轰鸣早已平息……
```

---

### 2. 活动纪实（Activity）

* **存放路径**：`src/content/activity/{分类或归档名称}/{活动名}.md`（如 `src/content/activity/other/2026-spring-welcome.md`）
* **URL 映射规则**：`activity/{分类}/{活动名}/`

#### Frontmatter 字段说明

| 字段 | 类型 | 是否必填 | 默认值 | 说明 |
| :--- | :--- | :---: | :--- | :--- |
| `title` | `string` | **必填** | - | 活动名称 |
| `date` | `YYYY-MM-DD` | **必填** | - | 活动举行日期 |
| `author` | `string` | 选填 | - | 纪实通讯作者或摄影记录人 |
| `location` | `string` | 选填 | - | 活动地点（如 `江安校区综合楼C座304`） |
| `hostType` | `string` | 选填 | - | 主办方类型：`department`（部门）或 `group`（小组） |
| `hostSlug` | `string` | 选填 | - | 主办方标识（对应部门或小组的 slug） |
| `tags` | `string[]` | 选填 | `[]` | 标签分类（如 `[校园活动, 观影会]`） |
| `summary` | `string` | 选填 | - | 列表卡片摘要 |
| `cover` | `string` | 选填 | - | 活动封面宣传图 |
| `indent` | `number` | 选填 | `0` | 段首缩进（活动纪实通常默认 0，段间留空） |

#### 活动模板范例

```markdown
---
title: 2026 年春季乘员集结大会暨科幻夜谈
date: 2026-03-12
author: "@小四宣传部"
location: 江安校区综合楼C座304
hostType: department
hostSlug: SFA
tags: [校园活动, 会员大会, 观影]
summary: 新老乘员齐聚江安，共同开启本次航程的全新探索纪元。
cover: /images/events/welcome-2026.jpg
indent: 0
---

2026 年 3 月 12 日晚，四川大学科幻协会于江安校区顺利召开春季乘员大会。

### 列车停靠与航程概览

本次大会由协会主席团主持，各部门负责人先后介绍了本学期的重点企划……
```

---

### 3. 兴趣小组（Groups）

* **存放路径**：`src/content/groups/{slug}.md`（如 `anime.md`、`boardgame.md`、`writing.md`）
* **展示位置**：网站【兴趣小组】通栏及卡片

#### Frontmatter 字段说明

| 字段 | 类型 | 是否必填 | 说明 |
| :--- | :--- | :---: | :--- |
| `title` | `string` | **必填** | 小组名称（如 `动画/特摄组`、`桌游/跑团组`） |
| `intro` | `string` | **必填** | 小组一句话定位或简短介绍 |
| `activities` | `string[]` | **必填** | 小组主要活动日常列表（至少 1 项） |
| `avatar` | `string` | 选填 | 小组标志头像（方形或圆形图片） |
| `order` | `number` | 选填 | 排序权重（数值越小越靠前） |
| `leader` | `object` | 选填 | 组长个人资料对象 |
| `leader.name` | `string` | 选填 | 组长姓名/昵称 |
| `leader.quote` | `string` | 选填 | 组长寄语或座右铭 |
| `leader.bio` | `string` | 选填 | 组长简介 |
| `leader.avatar` | `string` | 选填 | 组长头像 URL |
| `linkedActivities` | `string[]` | 选填 | 关联展示的活动 slug 列表（最多展示前 4 个） |

#### 兴趣小组模板范例

```markdown
---
title: 科幻写作与工坊组
intro: 构筑世界观，探讨推理想象，在这里雕琢每一个关于星海与未来的故事。
order: 1
avatar: /images/groups/writing-logo.png
activities:
  - 每月科幻命题接龙与创作研讨
  - 优秀科幻短篇研读与拆解
  - 年度科幻征文评审交流
leader:
  name: 观测员A
  quote: 用文字跨越光年，丈量思想的边界。
  bio: 爱好硬科幻与赛博朋克写作，长期沉迷架空世界观构筑。
  avatar: /images/members/leader-a.png
linkedActivities:
  - other/writing-workshop-2025
---

这里是小组更详细的背景介绍与正文补充内容……
```

---

## 三、图片与多媒体素材管理

### 1. 推荐放置路径
- **全站公用素材**：统一存放于项目根目录 `public/images/` 下（如 `public/images/articles/`、`public/images/events/`）。
- **Markdown 中引用方式**：直接以 `/` 开头引用，Astro 会自动处理 GitHub Pages 的子路径适配：
  ```markdown
  ![探索者号空间站](/images/articles/observer.jpg)
  ```
- **远程素材**：支持以 `https://` 开头的外部图床地址（推荐使用稳定图床，如 Unsplash、GitHub 等）。

### 2. 图片尺寸与排版建议
- **文章封面（Cover）**：推荐采用 **16:9** 比例（如 `1920×1080` 或 `1280×720`），能够保证在列表卡片与详情页顶部像素级完美自适应。
- **自定义尺寸缩放**：支持内联 HTML 控制图片缩放比例：
  ```html
  <img src="/images/events/demo.jpg" alt="说明" style="zoom: 80%;" />
  ```

---

## 四、Markdown 高级排版手册

本网站集成了高度定制的 Remark 与 Rehype 解析流水线，支持 Obsidian 语法、LaTeX 数学公式与精美卡片样式。

### 1. Obsidian 呼出框（Callouts）与折叠面板

使用引用语法 `> [!TYPE]` 即可生成 Apple 风格高质感毛玻璃提示卡片，支持**20+ 种语义配色**：

#### 基础语法

```markdown
> [!NOTE]
> 这是默认的蓝色重要提示卡片。

> [!TIP]
> 这是一个绿色建议卡片，适合给出技巧。

> [!WARNING]
> 这是一个橙黄色警告卡片，提醒需要注意的设定。

> [!CAUTION]
> 这是一个红色的危险或严重警示卡片。

> [!IMPORTANT]
> 这是一个优雅的紫色重要说明卡片。
```

#### 自定义卡片标题
在类型后空格跟上自定义标题：
```markdown
> [!NOTE] 航行日志：第 1024 个恒星日
> 所有监测探针均处于静默监听模式。
```

#### 可折叠手风琴面板（Collapsible Callouts）
在类型后加上 `+`（默认展开）或 `-`（默认折叠）：
```markdown
> [!FAQ]- 点击展开设定详情
> 这里是平时隐藏的庞大世界观背景设定，点击标题即可顺畅折叠/展开。
```

#### 完整主题支持速查表
- **蓝色系**：`[!NOTE]`、`[!INFO]`、`[!TODO]`
- **绿色系**：`[!TIP]`、`[!HINT]`、`[!SUCCESS]`、`[!CHECK]`、`[!DONE]`、`[!ABSTRACT]`、`[!SUMMARY]`、`[!TLDR]`
- **紫色系**：`[!IMPORTANT]`、`[!EXAMPLE]`
- **橙黄系**：`[!WARNING]`、`[!QUESTION]`、`[!HELP]`、`[!FAQ]`
- **红色系**：`[!CAUTION]`、`[!ATTENTION]`、`[!DANGER]`、`[!ERROR]`、`[!BUG]`、`[!FAILURE]`、`[!FAIL]`、`[!MISSING]`
- **中性灰**：`[!QUOTE]`、`[!CITE]`

---

### 2. LaTeX / KaTeX 数学公式

无需手动引入 JS，原生支持 LaTeX 数学符号与物理方程渲染：

- **行内公式**：使用单个美元符号 `$ ... $` 包裹：
  ```markdown
  狭义相对论的核心质能等价公式为 $E = mc^2$。
  ```
- **块级公式**：使用双美元符号 `$$ ... $$` 独立成段：
  ```markdown
  $$
  i\hbar \frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \left[ -\frac{\hbar^2}{2m}\nabla^2 + V(\mathbf{r},t) \right] \Psi(\mathbf{r},t)
  $$
  ```

---

### 3. 荧光笔高亮与 Obsidian 注释

- **荧光笔高亮**：使用双等号 `==` 包裹文字，呈现柔和浅金（暗色下为琥珀色）高光标记：
  ```markdown
  在整个恒星系湮灭之前，==我们有且仅有一次跳跃机会==。
  ```
- **源码级私有注释（编译时自动剥离）**：使用 `%%` 包裹，内容**仅在源码可见**，不会输出到公开网页：
  ```markdown
  这里是公开的正文。%% 这是一段作者未完成的灵感笔记，读者完全看不到 %% 继续正文。
  ```

---

### 4. 双向链接（WikiLinks）与内嵌语法

- **引用站内文章**：无需硬编码复杂相对路径，使用双中括号即可自动解析为文章链接：
  ```markdown
  参考社刊前作：[[bailiqin-jjsnbyssgyzstbqcs|白枥琴专栏]]
  ```
- **内嵌图片及尺寸控制**：
  ```markdown
  ![[spacestation.png|600]]
  ```

---

### 5. 段首缩进与对齐控制

#### 全局与局部缩进
- 文章详情页默认对每个段落应用 `2em` 段首中文缩进。
- **取消单段缩进**（如引言、诗歌、通讯录等）：
  ```html
  <p class="no-indent">这一段不会应用段首两个汉字的缩进。</p>
  ```

#### 文本对齐标签
支持在正文中使用便捷排版标签：
```html
<center>

### 献给所有在群星中守望的人

—— 2026 年春

</center>

<right>责任编辑：小四</right>
```

---

### 6. HTML 扩展排版标签（快捷键、注音、折叠）

本站点配置了安全的 HTML 标签放行通道，可直接在 Markdown 中混合使用以下语义化标签：

- **键盘按键样式**：
  ```html
  按 <kbd>Ctrl</kbd> + <kbd>K</kbd> 开启快速搜索。
  ```
- **汉字上方注音 / 假名（Ruby）**：
  ```html
  <ruby>迷星叫<rt>Mayoiuta</rt></ruby>
  ```
- **删除线与下划线标记**：
  ```markdown
  ~~被废弃的旧航线方案~~ 与 <ins>全新跃迁坐标</ins>
  ```
- **原生多媒体（Bilibili 视频内嵌）**：
  ```html
  <iframe src="//player.bilibili.com/player.html?bvid=BV1xx411c7mD&page=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" class="w-full aspect-video rounded-xl my-4"></iframe>
  ```

---

## 五、本地预览与提交检查清单

在提交 Pull Request 前，请进行以下自检：

1. [ ] **Frontmatter 格式校验**：三道杠 `---` 是否闭合，`date` 是否符合 `YYYY-MM-DD` 格式。
2. [ ] **分类路径正确**：文件是否放置在 `src/content/articles/` 或 `src/content/activity/` 对应的子文件夹内。
3. [ ] **本地构建通过**：在终端运行 `pnpm build`，确保没有解析报错或缺失字段警告。
4. [ ] **图片链接检查**：图片在暗色与亮色模式下均能正常显示，未出现裂图。
5. [ ] **目标分支明确**：Pull Request 的 base 分支必须选择 **`dev`**。

感谢你为四川大学科幻协会官方网站添砖加瓦！星海浩瀚，期待你的作品在此靠港。
