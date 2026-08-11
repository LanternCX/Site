# Cao Xin 的小站

一个基于 Astro、可直接接入 Obsidian Vault 的个人博客。

## 预览

![浅色主题下的桌面端与手机端首页](docs/images/home-page-2-light.png)

![深色主题下的桌面端与手机端首页](docs/images/home-page-2-dark.png)

## 快速开始

需要 Node.js 22.12 或更高版本。克隆仓库后，将博客内容子模块指向你自己的 Obsidian Vault：

```sh
git clone https://github.com/LanternCX/Site.git
cd Site
git submodule set-url src/content/blog <你的 Vault Git 地址>
git submodule update --init --remote src/content/blog
npm install
npm run astro -- dev --background
```

Vault 需要是一个 Git 仓库，其中的 Markdown 或 MDX 文章至少包含以下 Frontmatter：

```yaml
---
title: 文章标题
pubDate: 2026-08-11
---
```

随后修改以下内容完成个性化：

- 在 `src/consts.ts` 中设置站点名称、作者、简介和关键词。
- 在 `astro.config.mjs` 中设置正式域名。
- 在 `src/components/HomePage.astro` 中修改头像、欢迎语和社交链接。
- 在 `src/content/pages` 中修改 About 和 Friends 页面。

## Features

- 将 Obsidian Vault 作为独立 Git submodule 管理，按一级目录生成文章分类。
- 支持 Markdown、MDX、Obsidian Callout、当前文章标题链接和 KaTeX 数学公式。
- 自动处理本地图片，并在构建时优化和打包资源。
- 提供首页分页、站内搜索、文章归档和响应式文章目录。
- 支持深浅主题、RSS、Sitemap 和基础 SEO 元数据。
- 支持独立维护 About、Friends 等固定页面。

## 开发

```sh
npm install
npm run astro -- dev --background
```

后台开发服务器可以通过以下命令管理：

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

## 验证

```sh
npm test
npm run build
```
