---
title: 四川大学科幻协会官方网站投稿与排版指南
date: 2026-09-05
author: "@小四技术部"
tags: [投稿指南, 排版规范, 站点文档]
summary: 详细指引社员与创作者如何在官网投稿文章、归档活动纪实、登记兴趣小组，并包含全套 Frontmatter 规范与 Markdown/Obsidian 高级排版技巧。
indent: 0
align: left
---

> [!TIP] 欢迎投稿
> 四川大学科幻协会官方网站向所有社员、校友以及科幻创作者开放投稿！无论是科幻小说、学术书评、影评杂感，还是活动纪实，你都可以通过 GitHub 将文字驻留在协会的机密档案室中。

---

## 一、投稿快速流程（4 步）

本站为开源静态站点，所有文章与活动均由 Markdown 文件驱动：

1. **Fork 本仓库**：访问 GitHub 仓库 [Xiaosi-SFA/sfaweb](https://github.com/Xiaosi-SFA/sfaweb) 并 Fork 到你的个人账号；
2. **基于 `dev` 分支创建分支**：
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b content/my-new-post
   ```
3. **编写 Markdown 并放置素材**：
   - 文章存放在 `src/content/articles/{分类}/`
   - 活动存放在 `src/content/activity/{分类}/`
   - 兴趣小组存放在 `src/content/groups/`
4. **提交 Pull Request**：推送分支后，在 GitHub 发起指向官方仓库 **`dev`** 分支的 PR，审核通过后将自动构建发布上线。

---

## 二、三大投稿板块 Frontmatter 规范

所有内容文件顶部均需包含三道短横线 `---` 包裹的 YAML 元数据：

### 1. 文章板块（Articles）
存放目录：`src/content/articles/{分类}/{文件名}.md`

* **四个二级子分类**：
  * `classics/`：科幻名篇选读、经典诗歌古文
  * `contributions/`：原创科幻小说、科幻诗歌投稿
  * `essays/`：科幻杂谈、社团漫谈、随笔杂感
  * `reviews/`：影视科幻评析、科幻书评

```markdown
---
title: 最后的观测者与逆熵之海
date: 2026-09-05
author: 探索者四号
tags: [小说, 硬科幻, 征文投稿]
summary: 当宇宙微波背景辐射归于绝对零度，观测站的指示灯亮起了最后一次红芒。
cover: /images/articles/observer.jpg
indent: 2
---
正文内容……
```

### 2. 活动纪实板块（Activity）
存放目录：`src/content/activity/{归档目录}/{活动名}.md`（如 `src/content/activity/other/spring-gathering.md`）

```markdown
---
title: 2026 年春季乘员集结大会暨科幻夜谈
date: 2026-03-12
author: "@小四宣传部"
location: 江安校区综合楼C座304
hostType: department
hostSlug: SFA
tags: [校园活动, 会员大会]
summary: 新老乘员齐聚江安，共同开启本次航程的全新探索纪元。
indent: 0
---
活动纪实正文……
```

### 3. 兴趣小组登记（Groups）
存放目录：`src/content/groups/{slug}.md`

```markdown
---
title: 科幻写作与工坊组
intro: 构筑世界观，探讨推理想象，在这里雕琢每一个关于星海与未来的故事。
order: 1
avatar: /images/groups/writing-logo.png
activities:
  - 每月科幻命题接龙与创作研讨
  - 优秀科幻短篇研读与拆解
leader:
  name: 观测员A
  quote: 用文字跨越光年，丈量思想的边界。
  bio: 爱好硬科幻与赛博朋克写作。
---
小组介绍正文……
```

---

## 三、图片素材管理

1. **本地素材推荐路径**：统一存放在 `public/images/` 中，例如 `public/images/articles/`。在 Markdown 中使用以 `/` 开头的绝对路径引用：
   ```markdown
   ![空间站全貌](/images/articles/spacestation.jpg)
   ```
2. **封面图比例**：建议采用 **16:9** 比例（如 `1920×1080`），在列表卡片与详情页上可获得最佳适配。
3. **外部图床**：亦支持 Unsplash、GitHub、微信公众平台等外部稳定图床的 `https://` 链接。

---

## 四、高级排版手册

本站支持包括 Obsidian 语法扩展与 LaTeX 公式在内的多项高级排版特性：

### 1. Obsidian 呼出框（Callouts）
使用 `> [!TYPE]` 语法生成 Apple 风格半透明彩色提示框，支持 `+`/`-` 折叠：

> [!NOTE] 航行日志
> 这是一条默认展开的信息卡片。

> [!TIP] 技巧提示
> 写作前列好世界观大纲能大幅提升叙事连贯性。

> [!FAQ]- 点击查看展开设定（默认折叠）
> 这里是平时收起的世界观隐藏背景，点击标题展开！

### 2. LaTeX 数学与物理公式
- **行内公式**：`$E = mc^2$` 渲染为 $E = mc^2$。
- **块级公式**：
  $$
  i\hbar \frac{\partial}{\partial t}\Psi(\mathbf{r},t) = \hat{H}\Psi(\mathbf{r},t)
  $$

### 3. 荧光笔高亮与双链
- **荧光笔标记**：使用 `==重点高亮==` 渲染为柔光高亮底色。
- **Obsidian 风格内部双链**：使用 `[[文章slug|显示文字]]` 快速跳转站内其他文章。
- **Obsidian 隐藏批注**：使用 `%% 私人备忘 %%` 在公开页面中自动隐藏。

### 4. 段落对齐与排版
- 可以使用 `<center>居中文本</center>` 或 `<right>右对齐签名</right>` 自定义版式。
- 诗歌、戏剧对白等不需要首行缩进的内容，可加上 `<p class="no-indent">` 局部关闭缩进。

---

> [!NOTE] 更多信息
> 如需查阅完整的 Markdown 排版示例与仓库源码级说明，请参见仓库内文档目录 [docs/README.md](https://github.com/Xiaosi-SFA/sfaweb/blob/dev/docs/README.md)。
