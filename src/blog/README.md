# TodoCity blog

One Markdown file per post. The file name is the address: `best-todo-app-2027.md` → `todocity.app/blog/best-todo-app-2027`.

Frontmatter (all required):

```
---
title: The <title> tag, under ~60 characters
h1: The heading on the page
description: The meta description, under ~155 characters
excerpt: One sentence for the blog list
date: 2026-11-02
author: Name, role
image: /blog/img/cover.webp
---
```

- Use `##` and `###` headings; the title comes from the frontmatter.
- Images go in `public/blog/img/` (WebP or PNG). Write `![alt text](/blog/img/x.webp "caption")`; width and height are read at build time.
- Posts are built by `scripts/blog-content.mjs`, prerendered with the rest of the site, listed at `/blog`, and added to `sitemap.xml` and `llms.txt`.
