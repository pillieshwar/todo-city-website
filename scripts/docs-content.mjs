// TodoCity Docs: turns the Markdown pages in src/docs/ into what the site
// needs at build time. Used by the Vite plugin (vite.config.ts), which serves
// the pages as virtual modules, and by scripts/prerender.mjs, which writes the
// raw Markdown, the search index, the sitemap and llms.txt.
//
// Authoring guide: src/docs/README.md. Nothing here runs in the browser.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { Marked } from "marked";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
export const DOCS_DIR = join(ROOT, "src", "docs");
const PUBLIC = join(ROOT, "public");
export const ORIGIN = "https://todocity.app";
export const SECTIONS = JSON.parse(readFileSync(join(DOCS_DIR, "sections.json"), "utf8"));

// ── Small helpers ──────────────────────────────────────────────────────────
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const stripTags = (html) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
export const slugify = (text) =>
  stripTags(text)
    .toLowerCase()
    .replace(/(\d)\.(?=\d)/g, "$1-")
    .replace(/[⌘⇧⌥⌃]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || "section";

/** "a: b" lines between --- fences. Values are plain strings (quotes optional); `order` is a number. */
function frontmatter(src, file) {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(src);
  if (!m) throw new Error(`docs: ${file} has no frontmatter`);
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = /^([a-zA-Z]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^".*"$/.test(v) || /^'.*'$/.test(v)) v = v.slice(1, -1);
    data[kv[1]] = kv[1] === "order" ? Number(v) : v;
  }
  for (const key of ["title", "description", "section"]) if (!data[key]) throw new Error(`docs: ${file} needs "${key}" in its frontmatter`);
  if (!Number.isFinite(data.order)) throw new Error(`docs: ${file} needs a numeric "order"`);
  if (!SECTIONS.some((s) => s.id === data.section)) throw new Error(`docs: ${file} has an unknown section "${data.section}"`);
  return { data, body: src.slice(m[0].length) };
}

/** Width and height of a WebP or PNG in public/, so images reserve their space. */
export function imageSize(src) {
  const file = join(PUBLIC, src.replace(/^\//, ""));
  if (!existsSync(file)) throw new Error(`docs: image ${src} is not in public/`);
  const b = readFileSync(file);
  if (b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    const kind = b.toString("ascii", 12, 16);
    if (kind === "VP8 ") return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    if (kind === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (kind === "VP8X") return { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
  }
  if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  throw new Error(`docs: can't read the size of ${src}`);
}

/** The day a file last changed in git (or the latest commit, or today). */
function lastUpdated(file) {
  const git = (args) => {
    try {
      return execFileSync("git", args, { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
      return "";
    }
  };
  const iso = git(["log", "-1", "--format=%cI", "--", file]) || git(["log", "-1", "--format=%cI"]);
  return (iso || new Date().toISOString()).slice(0, 10);
}

// ── Release notes, from the app's src/whats-new.json (copied in) ───────────
export function releaseNotes() {
  const notes = JSON.parse(readFileSync(join(DOCS_DIR, "whats-new.json"), "utf8"));
  return Object.entries(notes).map(([version, lines]) => ({ version, lines }));
}
const releaseMarkdown = () =>
  releaseNotes()
    .map(({ version, lines }, i) => `## ${version}${i === 0 ? " (current)" : ""}\n\n${lines.map((l) => `- ${l}`).join("\n")}`)
    .join("\n\n");

// ── Facts used across pages: {{version}}, {{download}}, {{requirements}}, {{repo}} ──
// One place to change them. {{version}} is the newest entry in whats-new.json.
export const VARS = {
  version: releaseNotes()[0].version,
  download: "https://github.com/pillieshwar/TodoCity/releases/latest/download/TodoCity-macOS.dmg",
  requirements: "macOS 11 or later, Apple silicon and Intel",
  repo: "https://github.com/pillieshwar/TodoCity",
};

// ── Markdown → HTML ────────────────────────────────────────────────────────
const CALLOUTS = { NOTE: ["note", "Note"], TIP: ["tip", "Tip"], PRIVATE: ["private", "Private by default"] };

/** Expand `:::release-notes` and {{variables}}, and drop TODO comments, before anything else sees the text. */
function prepare(body, file) {
  return body
    .replace(/^:::release-notes\s*$/m, releaseMarkdown)
    .replace(/<!--[\s\S]*?-->\n?/g, "")
    .replace(/\{\{\s*([a-z]+)\s*\}\}/g, (_, name) => {
      if (!(name in VARS)) throw new Error(`docs: ${file} uses an unknown variable {{${name}}}; known: ${Object.keys(VARS).join(", ")}`);
      return VARS[name];
    });
}

// Small line icons for link lists, picked by where the link goes.
const ICON_PATHS = [
  ["/docs/install", "M8 2v8M4.5 6.8 8 10.3l3.5-3.5M2.5 13.5h11"],
  ["/docs/quick-start", "M4.5 2.8v10.4L13 8z"],
  ["/docs/capture", "M3 3h7l3 3v7H3zM10 3v3h3M5.5 9h5M5.5 11h3"],
  ["/docs/dates-and-times", "M2.5 4h11v9.5h-11zM2.5 7h11M5.5 2.5v3M10.5 2.5v3"],
  ["/docs/today", "M8 2.5v1.3M8 12.2v1.3M2.5 8h1.3M12.2 8h1.3M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"],
  ["/docs/calendar", "M2.5 4h11v9.5h-11zM2.5 7h11M5.5 2.5v3M10.5 2.5v3"],
  ["/docs/ai-models", "M5 5h6v6H5zM6.5 2.5V5M9.5 2.5V5M6.5 11v2.5M9.5 11v2.5M2.5 6.5H5M2.5 9.5H5M11 6.5h2.5M11 9.5h2.5"],
  ["/docs/keyboard-shortcuts", "M1.5 4.5h13v7h-13zM4 7h.01M6.5 7h.01M9 7h.01M11.5 7h.01M5 9.2h6"],
  ["/docs/privacy", "M4 7.5V5.5a4 4 0 0 1 8 0v2M3 7.5h10v6.5H3z"],
  ["/docs/data", "M3 3.5h10v3H3zM3 9.5h10v3H3zM5.5 5h.01M5.5 11h.01"],
  ["/docs/connectors/apple-reminders", "M5 1.5h6v13H5zM7.3 12.5h1.4"],
  ["/docs/connectors/apple-calendar", "M2.5 4h11v9.5h-11zM2.5 7h11M5.5 2.5v3M10.5 2.5v3"],
  ["/docs/connectors/slack", "M2.5 3h11v7.5H7L4 13v-2.5H2.5z"],
  ["/docs/connectors", "M2.5 8h9M8.5 4.5 12 8l-3.5 3.5"],
  ["/docs/sync-between-macs", "M1.5 3.5h7v5h-7zM7.5 8.5h7v5h-7z"],
  ["/docs/email-to-tasks", "M2 4h12v8.5H2zM2 4.5l6 4.5 6-4.5"],
  ["/docs/agents", "M2.5 4.5 6 8l-3.5 3.5M8 12h5.5"],
  ["/docs/watch", "M1.5 8s2.4-4.5 6.5-4.5S14.5 8 14.5 8 12.1 12.5 8 12.5 1.5 8 1.5 8zM8 6.3a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z"],
  ["/docs/city", "M2.5 13.5V6.5l3-2v9M5.5 13.5V3.5l4-1.5v11.5M9.5 13.5V7l4 1.5v5M1.5 13.5h13"],
  ["/docs/modes", "M2.5 4.5h11M2.5 8h11M2.5 11.5h11M5 3v3M10 6.5v3M7 10v3"],
  ["/docs/troubleshooting", "M8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM6.3 6.2a1.8 1.8 0 1 1 2.5 1.7c-.5.2-.8.6-.8 1.1M8 11h.01"],
  ["/docs/release-notes", "M3.5 2.5h9v11h-9zM5.5 5.5h5M5.5 8h5M5.5 10.5h3"],
  ["https://github.com", "M5.5 4 2 8l3.5 4M10.5 4 14 8l-3.5 4"],
];
const DEFAULT_ICON = "M4 1.8h5.4L12.5 5v9.2H4zM9.2 1.9v3.3h3.2";
const iconFor = (href) => (ICON_PATHS.find(([p]) => href === p || href.startsWith(`${p}/`) || href.startsWith(`${p}#`) || (p.startsWith("http") && href.startsWith(p))) ?? [null, DEFAULT_ICON])[1];
const iconSvg = (d) =>
  `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;

function render(body, file) {
  const headings = [];
  const used = new Set();
  // Each table is a labelled region; its label starts with the heading above it, so labels stay unique.
  let lastHeading = "";
  const marked = new Marked({ gfm: true });
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        if (depth === 1) throw new Error(`docs: ${file} has a "#" heading; the title comes from the frontmatter`);
        let id = slugify(inner);
        for (let n = 2; used.has(id); n++) id = `${slugify(inner)}-${n}`;
        used.add(id);
        headings.push({ depth, id, text: stripTags(inner) });
        lastHeading = stripTags(inner);
        return `<h${depth} id="${id}"><a class="dx-anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${inner}</h${depth}>\n`;
      },
      table(token) {
        const head = token.header.map((c) => `<th scope="col"${c.align ? ` style="text-align:${c.align}"` : ""}>${this.parser.parseInline(c.tokens)}</th>`).join("");
        const rows = token.rows
          .map(
            (r) =>
              `<tr>${r
                .map((c, i) => (i === 0 ? `<th scope="row">${this.parser.parseInline(c.tokens)}</th>` : `<td>${this.parser.parseInline(c.tokens)}</td>`))
                .join("")}</tr>`,
          )
          .join("\n");
        const columns = token.header.map((c) => stripTags(this.parser.parseInline(c.tokens))).join(" and ");
        const label = lastHeading ? `${lastHeading}: ${columns}` : columns;
        return `<div class="dx-table" role="region" aria-label="${esc(label)}" tabindex="0"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
      },
      blockquote({ tokens }) {
        const first = tokens[0];
        const m = first?.type === "paragraph" ? /^\[!(NOTE|TIP|PRIVATE)\]\s*/.exec(first.raw) : null;
        if (!m) return `<blockquote>${this.parser.parse(tokens)}</blockquote>\n`;
        const [kind, label] = CALLOUTS[m[1]];
        const rest = first.raw.slice(m[0].length).trim();
        const body = this.parser.parse([...(rest ? marked.lexer(rest) : []), ...tokens.slice(1)]);
        return `<div class="dx-callout dx-${kind}" role="note"><p class="dx-callout-label">${label}</p>${body}</div>\n`;
      },
      paragraph({ tokens }) {
        // A paragraph that is just one image becomes a figure with a caption.
        if (tokens.length === 1 && tokens[0].type === "image") return figure(tokens[0]);
        return `<p>${this.parser.parseInline(tokens)}</p>\n`;
      },
      image(token) {
        const { w, h } = imageSize(token.href);
        return `<img src="${esc(token.href)}" alt="${esc(token.text)}" width="${w}" height="${h}" loading="lazy" decoding="async">`;
      },
      link({ href, title, tokens }) {
        const inner = this.parser.parseInline(tokens);
        // [Label](url "button") is a call-to-action button.
        if (title === "button") return `<a class="dx-button" href="${esc(href)}">${inner}</a>`;
        const external = /^https?:\/\//.test(href) && !href.startsWith(ORIGIN);
        return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ""}${external ? ' target="_blank" rel="noreferrer"' : ""}>${inner}</a>`;
      },
      html({ text }) {
        return text.startsWith("<!--") ? "" : text;
      },
    },
  });
  function figure(token) {
    const { w, h } = imageSize(token.href);
    const tall = h > w ? " dx-figure-tall" : "";
    const caption = token.title ? `<figcaption>${marked.parseInline(token.title)}</figcaption>` : "";
    return `<figure class="dx-figure${tall}"><img src="${esc(token.href)}" alt="${esc(token.text)}" width="${w}" height="${h}" loading="lazy" decoding="async">${caption}</figure>\n`;
  }

  // ::: blocks: steps (a numbered list), cards (links with a line each, shown as a
  // two-column list with icons) and start (two columns split by a "+++" line).
  const html = body
    .split(/^(:::[a-z-]+\s*\n[\s\S]*?\n:::\s*)$/m)
    .map((part) => {
      const m = /^:::([a-z-]+)\s*\n([\s\S]*?)\n:::\s*$/.exec(part);
      if (!m) return marked.parse(part);
      const [, kind, inner] = m;
      if (kind === "steps") return marked.parse(inner).replace(/^<ol>/, '<ol class="dx-steps">');
      if (kind === "cards") {
        const links = inner
          .split("\n")
          .filter((l) => l.trim().startsWith("- "))
          .map((l) => {
            const c = /^- \[([^\]]+)\]\(([^)]+)\)\s*(.*)$/.exec(l.trim());
            if (!c) throw new Error(`docs: ${file} has a card that isn't "- [Title](/docs/…) Text": ${l}`);
            const external = /^https?:\/\//.test(c[2]) && !c[2].startsWith(ORIGIN);
            return `<li><a class="dx-link" href="${esc(c[2])}"${external ? ' target="_blank" rel="noreferrer"' : ""}><span class="dx-link-icon">${iconSvg(iconFor(c[2]))}</span><span class="dx-link-body"><span class="dx-link-title">${marked.parseInline(c[1])}</span><span class="dx-link-text">${marked.parseInline(c[3])}</span></span></a></li>`;
          });
        return `<ul class="dx-links">${links.join("")}</ul>\n`;
      }
      if (kind === "start") {
        const cols = inner.split(/^\+\+\+\s*$/m);
        if (cols.length !== 2) throw new Error(`docs: ${file} has a :::start block without one "+++" line between its two columns`);
        return `<div class="dx-start"><div class="dx-start-main">${marked.parse(cols[0])}</div><div class="dx-start-aside">${marked.parse(cols[1])}</div></div>\n`;
      }
      throw new Error(`docs: ${file} uses an unknown block ":::${kind}"`);
    })
    .join("");
  return { html, headings };
}

/** Plain text under each heading (and the intro), for search. */
function sections(html) {
  const out = [];
  const parts = html.split(/(<h[23] id="[^"]+">[\s\S]*?<\/h[23]>)/);
  let current = { id: "", heading: "", text: "" };
  for (const p of parts) {
    const h = /^<h[23] id="([^"]+)">([\s\S]*?)<\/h[23]>$/.exec(p);
    if (h) {
      out.push(current);
      current = { id: h[1], heading: stripTags(h[2]).replace(/^#\s*/, ""), text: "" };
    } else current.text += ` ${stripTags(p)}`;
  }
  out.push(current);
  return out.map((s) => ({ ...s, text: s.text.trim() })).filter((s) => s.heading || s.text);
}

/** The page as Markdown for people and AI tools: title, summary, then the body with absolute links. */
function cleanMarkdown(data, body, path) {
  const text = body
    .replace(/^:::(steps|cards|start)\s*\n/gm, "")
    .replace(/^\+\+\+\s*$/gm, "")
    .replace(/ "button"\)/g, ")")
    .replace(/^:::\s*$/gm, "")
    .replace(/\]\(\//g, `](${ORIGIN}/`)
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `# ${data.title}\n\n> ${data.description}\n\nSource: ${ORIGIN}${path}\n\n${text}\n`;
}

// ── All pages ──────────────────────────────────────────────────────────────
function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return name.endsWith(".md") && name !== "README.md" ? [full] : [];
  });
}

/** Every docs page, in sidebar order: { path, file, title, description, section, order, nav, updated, headings, html, md, search }. */
export function loadDocs() {
  const pages = walk(DOCS_DIR).map((full) => {
    const file = relative(ROOT, full).split(sep).join("/");
    const rel = relative(DOCS_DIR, full).split(sep).join("/").replace(/\.md$/, "");
    const path = rel === "index" ? "/docs" : `/docs/${rel}`;
    const { data, body } = frontmatter(readFileSync(full, "utf8"), file);
    const prepared = prepare(body, file);
    const { html, headings } = render(prepared, file);
    return {
      path,
      file,
      title: data.title,
      nav: data.nav || data.title,
      description: data.description,
      section: data.section,
      order: data.order,
      updated: lastUpdated(file),
      headings,
      html,
      md: cleanMarkdown(data, prepared, path),
      search: sections(html),
    };
  });
  const seen = new Set();
  for (const p of pages) {
    if (seen.has(p.path)) throw new Error(`docs: two pages for ${p.path}`);
    seen.add(p.path);
  }
  checkLinks(pages);
  const sectionIndex = (id) => SECTIONS.findIndex((s) => s.id === id);
  return pages.sort((a, b) => sectionIndex(a.section) - sectionIndex(b.section) || a.order - b.order || a.path.localeCompare(b.path));
}

/** Every /docs link and #anchor in every page must lead somewhere; the build stops otherwise. */
function checkLinks(pages) {
  const byPath = new Map(pages.map((p) => [p.path, p]));
  const problems = [];
  for (const p of pages) {
    for (const [, href] of p.html.matchAll(/href="([^"]+)"/g)) {
      if (href.startsWith("#")) {
        if (href.length > 1 && !p.html.includes(`id="${href.slice(1)}"`)) problems.push(`${p.file}: ${href} has no heading`);
        continue;
      }
      if (!href.startsWith("/docs") || href.startsWith("/docs/img/") || href.endsWith(".md")) continue;
      const [path, anchor] = href.split("#");
      const target = byPath.get(path.replace(/\/+$/, "") || "/docs");
      if (!target) problems.push(`${p.file}: ${href} is not a docs page`);
      else if (anchor && !target.html.includes(`id="${anchor}"`)) problems.push(`${p.file}: ${href} has no heading #${anchor}`);
    }
  }
  if (problems.length) throw new Error(`docs: links that lead nowhere:\n  ${problems.join("\n  ")}`);
}

// ── Virtual modules (Vite and the test harness share these) ────────────────
export const INDEX_ID = "virtual:docs";
export const PAGE_PREFIX = "virtual:docs-page";

/** The index: every page's details without its body, and a loader for each body. */
export function indexModule(pages) {
  const meta = pages.map(({ html: _h, md: _m, search: _s, ...rest }) => rest);
  const loaders = pages.map((p) => `  ${JSON.stringify(p.path)}: () => import(${JSON.stringify(`${PAGE_PREFIX}${p.path}`)}),`).join("\n");
  return `export const DOCS = ${JSON.stringify(meta)};\nexport const loaders = {\n${loaders}\n};\n`;
}

/** One page's body: its HTML and its Markdown. */
export function pageModule(pages, id) {
  const path = id.slice(PAGE_PREFIX.length);
  const page = pages.find((p) => p.path === path);
  if (!page) throw new Error(`docs: no page for ${path}`);
  return `export default ${JSON.stringify({ html: page.html, md: page.md })};\n`;
}

/** The Vite plugin: `import { DOCS, loaders } from "virtual:docs"`. */
export function docsPlugin() {
  let pages = null;
  const get = () => (pages ??= loadDocs());
  return {
    name: "todocity-docs",
    resolveId(id) {
      if (id === INDEX_ID || id.startsWith(PAGE_PREFIX)) return `\0${id}`;
      return null;
    },
    load(id) {
      if (id === `\0${INDEX_ID}`) return indexModule(get());
      if (id.startsWith(`\0${PAGE_PREFIX}`)) return pageModule(get(), id.slice(1));
      return null;
    },
    configureServer(server) {
      // In `npm run dev`, editing a page reloads it.
      server.watcher.add(DOCS_DIR);
      server.watcher.on("change", (f) => {
        if (!f.startsWith(DOCS_DIR)) return;
        pages = null;
        for (const m of server.moduleGraph.idToModuleMap.values()) if (m.id?.startsWith("\0virtual:docs")) server.moduleGraph.invalidateModule(m);
        server.ws.send({ type: "full-reload" });
      });
    },
  };
}
