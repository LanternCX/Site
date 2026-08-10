# Cao Xin 的小站

基于 Astro 的个人博客。博客内容、固定页面和发布所需的静态资源统一保存在本仓库中。

## 内容结构

`src/content/blog` 可以直接作为 Obsidian Vault 使用。博客目录遵循以下约定：

```text
src/content/blog/
└── Note/                 # 一级目录：分类
    ├── OS.md             # 没有资源的普通文章
    └── DB/               # 带资源的文章包
        ├── DB.md
        └── assets/
            └── overview.svg
```

- 没有本地资源的文章直接放在分类目录中。
- 带资源的文章使用同名目录打包，目录可以位于分类下的任意深度。
- 文章包只包含一篇与所在目录同名的 Markdown 或 MDX 入口文章。
- 文章通过 `./assets/文件名` 引用自己的资源。
- About、Friends 等固定页面位于 `src/content/pages`，不参与博客分类。
- 本地 Markdown 图片由 Astro 在构建时优化并打包，不需要手动上传图床。

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
