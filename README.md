# 四川大学科幻协会官方网站 (SFA Web)

四川大学科幻协会（Sichuan University Science Fiction Association, SCU SFA）官方网站前端代码仓库。本项目采用静态站点生成（SSG）架构构建，用于社团动态发布、文章纪实归档、部门与兴趣小组展示及成员交流。

---

## 技术架构

- **核心框架**：[Astro 4](https://astro.build/)（静态输出模式）
- **样式方案**：[Tailwind CSS](https://tailwindcss.com/)
- **内容引擎**：Astro Content Collections
- **Markdown / 数学公式**：Remark / Rehype（GFM、KaTeX、Obsidian 语法扩展）
- **包管理器**：pnpm
- **CI / CD**：GitHub Actions + GitHub Pages

---

## 分支管理规范

本项目采用分支驱动的开发与部署流程：

- **`main` 分支**：生产与部署分支。受保护分支，所有提交会自动触发 GitHub Actions 工作流并发布到 GitHub Pages。
- **`dev` 分支**：日常开发分支。新功能开发、内容增补或样式修复均在 `dev` 分支（或基于 `dev` 创建的 feature 分支）进行，经本地构建验证后通过 Pull Request 合并入 `main`。

```text
feature / content update
          ↓
      dev 分支（开发与联调）
          ↓ (Pull Request / Review)
     main 分支（自动触发部署流水线 → GitHub Pages）
```

---

## 目录结构

```text
.
├── .github/workflows/
│   └── deploy.yml              # GitHub Actions 自动化构建与部署流水线
├── docs/                       # 站点文档与投稿指南（含 Frontmatter 模板与高级排版）
├── public/                     # 静态资源（图标、图片等无需编译的文件）
├── src/
│   ├── components/             # 可复用 UI 组件（导航栏、卡片、页脚等）
│   ├── content/                # 基于 Content Collections 的结构化内容
│   │   ├── about/              # 社团简介
│   │   ├── activity/           # 活动纪实
│   │   ├── articles/           # 文章与征文
│   │   ├── departments/        # 部门介绍
│   │   ├── deptGallery/        # 部门展示相册
│   │   ├── groups/             # 兴趣爱好小组
│   │   ├── lang/               # 国际化语言包
│   │   ├── links/              # 友情链接
│   │   ├── members/            # 成员名录
│   │   └── ribbon/             # 徽章墙数据
│   ├── layouts/                # 页面布局模板
│   ├── pages/                  # 静态路由页面与动态路由模板
│   ├── rehype/                 # 自定义 Rehype 插件
│   ├── remark/                 # 自定义 Remark 插件（Obsidian 语法等）
│   └── styles/                 # 全局样式与模块化 CSS
├── astro.config.mjs            # Astro 配置文件
├── sfa.config.json             # 站点功能特性配置
└── package.json                # 项目依赖与脚本定义
```

---

## 本地开发指南

### 环境要求

- Node.js `>= 18.14.1`
- pnpm `>= 9.0.0`

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动本地开发服务

```bash
pnpm dev
```

本地服务默认运行在 `http://localhost:4321`。

### 3. 本地构建与静态预览

```bash
# 静态构建产物至 dist/ 目录
pnpm build

# 本地预览构建产物
pnpm preview
```

### 4. 代码格式化

```bash
pnpm format
```

---

## 部署与配置

本仓库配置了 GitHub Actions 持续集成与部署工作流（[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)）。

### 自动部署流程

1. 当代码推送到 `main` 分支时，GitHub Actions 会自动执行依赖安装、静态构建并将 `dist/` 产物发布至 GitHub Pages。
2. 仓库设置中需将 GitHub Pages 构建源配置为 **GitHub Actions**（路径：`Settings -> Pages -> Build and deployment -> Source: GitHub Actions`）。

### 环境变量配置（可选）

如需自定义部署域名或子路径，可在仓库的 `Settings -> Secrets and variables -> Actions -> Variables` 中添加以下变量：

- `SITE_URL`：站点基础域名（如 `https://xiaosi-sfa.github.io` 或自定义域名 `https://sfa.example.com`）。
- `BASE_PATH`：部署的子路径（默认为仓库名 `/sfaweb/`，若绑定根域名则设置为 `/`）。

---

## 投稿指南与内容撰写

如果你想向网站投稿**科幻小说、评析、随笔**，或归档**社团活动纪实**、登记**兴趣小组**，欢迎查阅以下详细指引：

- **网站【杂谈】专栏在线版**：
  - 📖 [SFA 官方网站投稿与内容共建全指南](https://xiaosi-sfa.github.io/sfaweb/articles/essays/contribution-guide/)：投稿流程、三大板块规范与 Frontmatter 模板详解。
  - 🎨 [SFA Web 高级排版与 Markdown 渲染艺术手册](https://xiaosi-sfa.github.io/sfaweb/articles/essays/typesetting-guide/)：Obsidian Callouts、KaTeX 公式、荧光高亮与多媒体排版。
- **仓库代码文档版**：[docs/README.md](docs/README.md)（含完整贡献清单与本地工程化调试）

---

## 贡献指南

1. 从 `dev` 分支切出新的功能或内容分支：
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```
2. 完成修改并确保本地 `pnpm build` 构建无错误。
3. 提交更改并发起指向 `dev` 分支的 Pull Request。

---

## 许可证

本项目源代码及相关文档遵循相应开源许可。网站文章与活动图文内容版权归四川大学科幻协会及原作者所有。
