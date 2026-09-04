# SFA 社团官网（小四的机密档案室）

四川大学科幻协会（SFA）官方文章与活动纪实门户，基于 Astro 4 + Tailwind CSS 构建的静态站点（SSG），采用 Apple 风格极简设计语言，支持多语言与明暗主题，并通过 GitHub Actions 自动部署至 GitHub Pages。

---

## 特性亮点

- **Apple 风格极简设计**：高质感毛玻璃效果（Frosted Glass）、深浅主题自由切换、弹性卡片动效与精致排版。
- **纯静态构建（SSG）**：使用 Astro 4 原生静态输出，极速加载，无需 Node 服务端即可在 GitHub Pages 等任何静态服务商托管。
- **结构化内容管理**：基于 Astro Content Collections，严格校验文章、活动、部门、成员、友链及兴趣小组数据。
- **全动态多级路由**：完整支持多层级文章与活动分类，自动生成对应的静态 HTML 详情页与按标签聚合页。
- **RSS 静态订阅**：自动在构建期静态生成 `/rss.xml`，方便 RSS 订阅者获取社团最新文章与活动动态。
- **CI/CD 自动化**：内置 GitHub Actions 工作流，主分支有更新自动触发构建与发布。

---

## 技术栈

- **构建框架**：[Astro 4](https://astro.build/)（Static 输出模式）
- **样式方案**：[Tailwind CSS](https://tailwindcss.com/)
- **内容引擎**：Astro Content Collections + Markdown（支持 rehype/remark 安全清洗与中心对齐渲染）
- **部署平台**：GitHub Pages（通过 GitHub Actions）
- **包管理器**：pnpm (v9)

---

## 项目目录结构

```text
.
├── .github/workflows/
│   └── deploy.yml                   # GitHub Actions 自动构建与部署流水线
├── public/
│   ├── xiaosi.png                   # 首页 Hero 徽标
│   ├── favicon.svg                  # 站点矢量图标
│   └── back.png                     # 缺省卡片封面回退图
├── src/
│   ├── components/                  # 复用 UI 组件（卡片、导航栏、页脚等）
│   ├── content/                     # 内容集合 Markdown 数据源
│   │   ├── config.ts                # 内容集合 Schema 严格类型定义
│   │   ├── about/                   # 社团介绍
│   │   ├── activity/                # 活动纪实（支持 anime/organization 等子目录）
│   │   ├── articles/                # 社团文章（classics/essays/reviews/contributions）
│   │   ├── departments/             # 各部门简介
│   │   ├── deptGallery/             # 部门工作展示画廊
│   │   ├── groups/                  # 兴趣爱好小组
│   │   ├── lang/                    # 中英文界面文案（zh-cn.lang, en.lang）
│   │   ├── links/                   # 外部友链数据
│   │   ├── members/                 # 部门成员数据
│   │   └── ribbon/                  # 徽章墙数据
│   ├── layouts/
│   │   └── BaseLayout.astro         # 站点全局基础布局
│   ├── pages/                       # 静态路由页面
│   │   ├── 404.astro                # 404 错误页面（编译为 404.html）
│   │   ├── index.astro              # 首页
│   │   ├── rss.xml.ts               # RSS 订阅静态生成器
│   │   ├── about/                   # 关于我们页面与部门详情
│   │   ├── activity/                # 活动列表与 [...slug] 详情
│   │   ├── articles/                # 文章列表与 [...slug] 详情
│   │   ├── groups/                  # 兴趣小组页面
│   │   ├── links/                   # 友链页面
│   │   ├── tags/                    # 标签列表与 [tag] 聚合页面
│   │   └── [lang]/                  # 多语言静态路由代理
│   ├── styles/                      # 样式定义（包含 global.css, card.css, tag.css 等）
│   └── env.d.ts                     # Astro 类型支持
├── astro.config.mjs                 # Astro 核心配置文件
├── sfa.config.json                  # 排版与渲染特性开关
└── package.json                     # 项目配置与依赖
```

---

## 本地开发指南

### 1. 安装依赖

推荐使用 `pnpm`：

```bash
pnpm install
```

### 2. 本地开发调试

启动本地开发服务器：

```bash
pnpm dev
```

默认将在 `http://localhost:4321` 运行。

### 3. 本地静态构建与预览

执行静态编译：

```bash
pnpm build
```

产物将输出在 `dist/` 目录下。您可以使用以下命令本地预览构建效果：

```bash
pnpm preview
```

---

## 部署至 GitHub Pages

项目已包含完整的 GitHub Actions 持续部署配置（`.github/workflows/deploy.yml`）。

### 部署准备

1. **启用 GitHub Pages**：
   - 进入您的 GitHub 仓库：**Settings** -> **Pages**。
   - 在 **Build and deployment** 下的 **Source** 中选择 **GitHub Actions**。
2. **分支触发**：
   - 向 `main` 分支提交或推送代码，GitHub Actions 会自动触发构建并部署。

### 自定义域名或子路径支持

- **默认站点地址**：`https://<username>.github.io`
- 如果您部署在子路径（例如 `https://<username>.github.io/sfaweb/`），可以通过仓库的 **Settings** -> **Secrets and variables** -> **Actions** 添加变量：
  - `BASE_PATH`：例如 `/sfaweb/`
  - `SITE_URL`：例如 `https://<username>.github.io`
- 如果绑定了自定义独立域名（如 `https://sfa.scu.edu.cn`），保持 `BASE_PATH=/` 并设置 `SITE_URL` 即可。

---

## 验收与转为公开仓库指南

当您验收完毕并准备将当前私有仓库转为公开仓库时，如果希望提交历史干净整齐（没有多余的草稿或杂乱历史），建议按以下步骤操作：

### 方案 A：保留当前提交，直接转公开

在命令行运行：

```bash
gh repo edit --visibility public
```

### 方案 B：重置为一个干净的全新初始提交（推荐）

如果您希望公开仓库只有 1 个干净的 `Initial commit`：

```bash
# 1. 创建并切换到一个没有历史记录的全新孤立分支
git checkout --orphan clean-main

# 2. 将当前所有清理后的文件加入暂存区
git add -A

# 3. 提交全新起点
git commit -m "feat: initial commit for SFA website"

# 4. 删除旧的 main 分支并重命名新分支
git branch -D main
git branch -m main

# 5. 强制推送到 GitHub
git push -f origin main

# 6. 将仓库转为公开
gh repo edit --visibility public
```

---

## 许可证

本项目内容与代码归四川大学科幻协会（SFA）所有。
