# Cao Xin's Site

[中文](../README.md)

A personal blog built with Astro that can connect directly to an Obsidian Vault.

## Preview

Link: [www.caoxin.xyz](https://www.caoxin.xyz/)

![Desktop and mobile home pages in the light theme](images/home-page-2-light.png)

![Desktop and mobile home pages in the dark theme](images/home-page-2-dark.png)

## About This Site

This site is built with [Astro](https://github.com/withastro/astro) and my own blog theme, [LanternCX/Site](https://github.com/LanternCX/Site).

I completed the basic design and development of this site in August 2026, then migrated from the original [Typecho](https://typecho.org/) engine and [Akina-for-Typecho](https://github.com/Zisbusy/Akina-for-Typecho) theme to the current architecture.

The [LanternCX/Site](https://github.com/LanternCX/Site) repository includes independently implemented [remark](https://github.com/remarkjs/remark) plugins for parsing syntax such as [Obsidian Callouts](https://obsidian.md/help/callouts), along with frontend styles inspired by several [Obsidian themes](https://community.obsidian.md/search?type=theme).

After linking the blog's [Obsidian Vault](https://obsidian.md/help/vault), [LanternCX/Blogs](https://github.com/LanternCX/Blogs), under [LanternCX/Site](https://github.com/LanternCX/Site/tree/main/src/content), [GitHub Actions](https://github.com/features/actions) handles building, testing, and automatically deploying the Astro static site for a smooth writing and publishing experience.

You can also open [LanternCX/Blogs](https://github.com/LanternCX/Blogs) directly as a Vault in [Obsidian](https://obsidian.md) to read my blog.

The animated subtitle in the home page hero uses [TypewriterJS](https://github.com/tameemsafi/typewriterjs).

The commenting system uses [Giscus](https://github.com/giscus/giscus).

The site was designed and built throughout with [GPT](https://chatgpt.com/overview) models and [Codex](https://chatgpt.com/codex).

I currently plan to use this site as my personal blog for technical articles and occasional notes about my life.

## Quick start

Node.js 22.12 or later is required. Clone the repository, then point the blog content submodule to your own Obsidian Vault:

```sh
git clone https://github.com/LanternCX/Site.git
cd Site
git submodule set-url src/content/blog <your-vault-git-url>
git submodule update --init --remote src/content/blog
npm install
npm run astro -- dev --background
```

The Vault must be a Git repository. Each Markdown or MDX article needs at least the following frontmatter:

```yaml
---
title: Article title
pubDate: 2026-08-11
---
```

Customize the site in these locations:

- Set the site title, author, description, and keywords in `src/consts.ts`.
- Set the production URL in `astro.config.mjs`.
- Edit the avatar, greeting, and social links in `src/components/HomePage.astro`.
- Edit the About and Friends pages in `src/content/pages`.

## Development

```sh
npm install
npm run astro -- dev --background
```

Manage the background development server with:

```sh
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
```

## Verification

```sh
npm test
npm run build
```
