// The TodoCity blog: turns the Markdown posts in src/blog/ into HTML at build
// time and serves them as `virtual:blog` (vite.config.ts). Nothing here runs
// in the browser. How to write a post: src/blog/README.md.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";
import { imageSize } from "./docs-content.mjs";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
export const BLOG_DIR = join(ROOT, "src", "blog");
const ID = "virtual:blog";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const isExternal = (href) => /^https?:\/\//.test(href) && !href.startsWith("https://todocity.app");

function frontmatter(src, file) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  if (!m) throw new Error(`blog: ${file} has no frontmatter`);
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = /^([a-zA-Z][a-zA-Z0-9]*):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^".*"$/.test(v) || /^'.*'$/.test(v)) v = v.slice(1, -1);
    data[kv[1]] = v;
  }
  for (const key of ["title", "h1", "description", "date", "author", "image", "excerpt"]) {
    if (!data[key]) throw new Error(`blog: ${file} needs "${key}" in its frontmatter`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`blog: ${file} needs a date like 2026-11-02`);
  return { data, body: src.slice(m[0].length) };
}

function renderPost(md, file) {
  const marked = new Marked({ gfm: true });
  let first = true;
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        if (depth === 1) throw new Error(`blog: ${file} has a "#" heading; the title comes from the frontmatter`);
        return `<h${depth}>${this.parser.parseInline(tokens)}</h${depth}>\n`;
      },
      // ![alt](/blog/img/x.webp "caption") → a figure that reserves its space.
      image({ href, title, text }) {
        const { w, h } = imageSize(href);
        const img = `<img src="${esc(href)}" alt="${esc(text)}" width="${w}" height="${h}" ${first ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />`;
        first = false;
        return title ? `<figure class="post-fig">${img}<figcaption>${esc(title)}</figcaption></figure>` : `<figure class="post-fig">${img}</figure>`;
      },
      // A paragraph that's only an image doesn't get wrapped in <p>.
      paragraph({ tokens }) {
        if (tokens.length === 1 && tokens[0].type === "image") return this.parser.parseInline(tokens);
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
      },
      link({ href, title, tokens }) {
        const t = title ? ` title="${esc(title)}"` : "";
        const ext = isExternal(href) ? ' target="_blank" rel="noopener"' : "";
        return `<a href="${esc(href)}"${t}${ext}>${this.parser.parseInline(tokens)}</a>`;
      },
      table(token) {
        const cell = (c) => this.parser.parseInline(c.tokens);
        const head = token.header.map((c) => `<th scope="col">${cell(c)}</th>`).join("");
        const rows = token.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${cell(c)}</th>` : `<td>${cell(c)}</td>`)).join("")}</tr>`).join("");
        return `<div class="doc-table" role="region" aria-label="Comparison table" tabindex="0"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
    },
  });
  return marked.parse(md);
}

/** Every post, newest first. */
export function loadPosts() {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") && f !== "README.md")
    .map((f) => {
      const src = readFileSync(join(BLOG_DIR, f), "utf8");
      const { data, body } = frontmatter(src, f);
      imageSize(data.image); // the cover must exist
      const words = body.replace(/[#*|`>![\]()-]/g, " ").split(/\s+/).filter(Boolean).length;
      return {
        slug: f.replace(/\.md$/, ""),
        path: `/blog/${f.replace(/\.md$/, "")}`,
        ...data,
        minutes: Math.max(1, Math.round(words / 230)),
        html: renderPost(body, f),
        md: body,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function blogPlugin() {
  let posts = null;
  const get = () => (posts ??= loadPosts());
  return {
    name: "todocity-blog",
    resolveId: (id) => (id === ID ? `\0${ID}` : null),
    load: (id) => (id === `\0${ID}` ? `export const POSTS = ${JSON.stringify(get().map(({ md, ...p }) => p))};` : null),
    configureServer(server) {
      server.watcher.add(BLOG_DIR);
      server.watcher.on("change", (f) => {
        if (!f.startsWith(BLOG_DIR)) return;
        posts = null;
        const m = server.moduleGraph.getModuleById(`\0${ID}`);
        if (m) server.moduleGraph.invalidateModule(m);
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}
