---
title: SFA 官方网站投稿与内容共建全指南
date: 2026-09-05
author: "@Visio-Vanitas,Gemini"
tags: [投稿指南, 社团共建, 开源协作, 站点文档]
summary: 介绍向四川大学科幻协会官方网站提交文章、活动纪实与兴趣小组内容的流程，规范目录结构、Frontmatter 元数据定义及素材管理。
indent: 0
align: left
---

> [!NOTE] 说明
> 本文档定义四川大学科幻协会（SFA）官方网站的内容提交流程，涵盖文章、活动纪实与兴趣小组三大板块的目录结构、Frontmatter 字段规范及资源引入方式。

---

## 一、内容协作机制

本站采用静态内容生成（SSG）与开源协作模式。所有发布内容均以 Markdown 格式保存在仓库中，内容提交统一通过 Pull Request（PR）发起，经合并后由 GitHub Actions 自动编译发布至生产环境。

核心原则：
1. **源码管理**：正文与元数据由 Git 跟踪，每一次修改与审校均保留版本记录。
2. **结构化定义**：通过 Astro Content Collections 强类型模式校验元数据字段，避免格式不一致。
3. **样式与内容分离**：作者关注内容本身，排版渲染由站点统一的 CSS 规范处理。

---

## 二、提交方式

### 1. 网页端直接提交（GitHub Web）

适用于轻量内容提交，无需配置本地开发环境：

1. 访问官方仓库 [Xiaosi-SFA/sfaweb](https://github.com/Xiaosi-SFA/sfaweb) 并点击 **Fork**；
2. 进入 Fork 仓库，切换至 **`dev`** 分支（所有内容增补均基于 `dev`）；
3. 进入对应目录（如文章投稿进入 `src/content/articles/contributions/`），点击 **Add file -> Create new file**；
4. 指定文件名（格式为 `kebab-case.md`，使用英文字母与连字符），录入 Frontmatter 与正文；
5. 在页面底部填写提交描述，选择 **Propose changes**；
6. 确认目标分支为官方仓库的 **`dev`**，点击 **Create pull request**。

---

### 2. 本地开发环境提交

适用于需要本地调试渲染、批量提交或包含大量静态资源的场景：

```bash
# 1. 克隆 Fork 仓库
git clone git@github.com:your-username/sfaweb.git
cd sfaweb

# 2. 安装依赖并切换分支
pnpm install
git checkout dev
git pull origin dev
git checkout -b content/add-article-title

# 3. 启动开发服务器调试
pnpm dev
# 访问 http://localhost:4321 实时预览

# 4. 静态编译验证
pnpm build

# 5. 提交并推送
git add .
git commit -m "content: add article title"
git push origin content/add-article-title
```

在 GitHub 上向官方仓库的 **`dev`** 分支发起 PR。

---

## 三、板块目录结构与元数据规范

所有内容文件均使用 Markdown（`.md`），文件顶部必须包含由三道短横线 `---` 包裹的 YAML 元数据（Frontmatter）。

### 1. 文章板块（Articles）

存放路径：`src/content/articles/{分类}/{文件名}.md`

二级子目录对应栏目分类：
- `contributions/`：社员与读者投稿小说、诗歌。
- `reviews/`：书评、影视分析与作品评析。
- `essays/`：科幻杂谈、科学随笔与日常记录。
- `classics/`：科幻名篇选读、诗文归档。

#### Frontmatter 字段定义

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| :--- | :--- | :---: | :--- | :--- |
| `title` | `string` | **是** | - | 文章标题 |
| `date` | `YYYY-MM-DD` | **是** | - | 创作或定稿日期，列表按此字段降序排列 |
| `author` | `string` | 否 | `SFA` | 作者署名 |
| `tags` | `string[]` | 否 | `[]` | 标签列表，用于分类索引与文末推荐 |
| `summary` | `string` | 否 | - | 摘要文案，建议 80~200 字，上限 280 字 |
| `cover` | `string` | 否 | - | 封面图绝对路径或外部 URL，推荐 16:9 |
| `indent` | `number` | 否 | `2` | 段首缩进字符数，小说类设为 `2`，技术/随笔类可设为 `0` |
| `align` | `string` | 否 | `left` | 正文对齐方式（`left` / `center` / `right`） |

#### 文章模板

```markdown
---
title: 观测者与逆熵之海
date: 2026-09-05
author: 探索者四号
tags: [小说, 硬科幻, 投稿]
summary: 描述视界边缘观测站接收到的逆熵信号及其物理学推论。
cover: /images/articles/observer.jpg
indent: 2
align: left
---

正文内容从此处开始。

## 第一节 信号特征

正文二级标题下内容……
```

---

### 2. 活动纪实板块（Activity）

存放路径：`src/content/activity/{分类或归档名称}/{活动名}.md`（如 `src/content/activity/other/spring-assembly-2026.md`）

#### Frontmatter 字段定义

| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :---: | :--- |
| `title` | `string` | **是** | 活动名称 |
| `date` | `YYYY-MM-DD` | **是** | 活动举办日期 |
| `location` | `string` | 否 | 活动地点（如 `"江安校区综合楼C座304"`） |
| `author` | `string` | 否 | 通讯稿撰写人或记录人 |
| `tags` | `string[]` | 否 | 分类标签 |
| `summary` | `string` | 否 | 列表卡片摘要 |
| `cover` | `string` | 否 | 活动封面宣传图 |
| `hostType` | `string` | 否 | 主办方类型（`department` 或 `group`） |
| `hostSlug` | `string` | 否 | 主办方 slug 标识（如 `SFA` 或对应小组标识） |
| `indent` | `number` | 否 | 缩进字符数，活动稿通常为 `0` |

#### 活动纪实模板

```markdown
---
title: 2026 年春季乘员大会纪要
date: 2026-03-12
author: "@小四宣传部"
location: 江安校区综合楼C座304
hostType: department
hostSlug: SFA
tags: [校园活动, 会员大会]
summary: 2026 年春季乘员大会会议记录与新学期活动规划。
cover: /images/events/assembly-2026.jpg
indent: 0
---

会议记录正文……
```

---

### 3. 兴趣小组板块（Groups）

存放路径：`src/content/groups/{slug}.md`（如 `src/content/groups/writing.md`）

#### Frontmatter 字段定义

| 字段 | 类型 | 必填 | 说明 |
| :--- | :--- | :---: | :--- |
| `title` | `string` | **是** | 小组名称 |
| `intro` | `string` | **是** | 小组定位简述（上限 400 字） |
| `activities` | `string[]` | **是** | 常态化核心活动清单（至少 1 项） |
| `avatar` | `string` | 否 | 小组 Logo 图片路径 |
| `order` | `number` | 否 | 列表排序权重（升序） |
| `leader` | `object` | 否 | 组长信息对象（包含 `name`、`quote`、`bio`、`avatar`） |
| `linkedActivities` | `string[]` | 否 | 关联活动 slug 列表（卡片展示前 4 项） |

#### 兴趣小组模板

```markdown
---
title: 科幻写作与工坊组
intro: 专注于世界观架构、科幻短篇创作与文本推敲的讨论组。
order: 1
avatar: /images/groups/writing-logo.png
activities:
  - 每月主题创作与互评
  - 科幻短篇结构拆解
leader:
  name: 观测员A
  quote: 用文字丈量思想边界。
  bio: 专注于硬科幻写作。
  avatar: /images/members/leader-a.png
linkedActivities:
  - other/writing-workshop-2025
---

小组详细说明与章程……
```

---

## 四、静态资源引用规范

1. **本地资源**：
   - 统一存放在 `public/images/` 目录下（如 `public/images/articles/`、`public/images/events/`）。
   - 在 Markdown 中使用绝对路径引用（例如 `![图示](/images/articles/figure1.png)`），构建流水线会自动处理子路径前缀。
2. **图片比例**：
   - 卡片封面推荐采用 **16:9**（如 `1920×1080`、`1280×720`），避免在网格布局中产生垂直留白或拉伸。
3. **外部资源**：
   - 允许引用可直接访问的 HTTPS 图床链接。
4. **版权说明**：
   - 引用非原创图文素材时，需在文末注明作者与来源出处。

---

## 五、排版技术支持

关于正文中可使用的 Obsidian Callouts 呼出框、LaTeX 公式渲染、行内标记及多媒体嵌入规范，请参考文档：
👉 **[[typesetting-guide|SFA Web 高级排版与 Markdown 渲染艺术手册]]**。
