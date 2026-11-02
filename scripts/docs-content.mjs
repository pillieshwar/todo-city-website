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
function imageSize(src) {
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

// ── Markdown → HTML ────────────────────────────────────────────────────────
const CALLOUTS = { NOTE: ["note", "Note"], TIP: ["tip", "Tip"], PRIVATE: ["private", "Private by default"] };

/** Expand `:::release-notes`, and drop TODO comments, before anything else sees the text. */
function prepare(body) {
  return body.replace(/^:::release-notes\s*$/m, releaseMarkdown).replace(/<!--[\s\S]*?-->\n?/g, "");
}

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

  // ::: blocks: steps (a numbered list) and cards (a list of links with a line each).
  const html = body
    .split(/^(:::[a-z-]+\s*\n[\s\S]*?\n:::\s*)$/m)
    .map((part) => {
      const m = /^:::([a-z-]+)\s*\n([\s\S]*?)\n:::\s*$/.exec(part);
      if (!m) return marked.parse(part);
      const [, kind, inner] = m;
      if (kind === "steps") return marked.parse(inner).replace(/^<ol>/, '<ol class="dx-steps">');
      if (kind === "cards") {
        const cards = inner
          .split("\n")
          .filter((l) => l.trim().startsWith("- "))
          .map((l) => {
            const c = /^- \[([^\]]+)\]\(([^)]+)\)\s*(.*)$/.exec(l.trim());
            if (!c) throw new Error(`docs: ${file} has a card that isn't "- [Title](/docs/…) Text": ${l}`);
            return `<a class="dx-card" href="${esc(c[2])}"><span class="dx-card-title">${marked.parseInline(c[1])}</span><span class="dx-card-text">${marked.parseInline(c[3])}</span></a>`;
          });
        return `<div class="dx-cards">${cards.join("")}</div>\n`;
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
    .replace(/^:::(steps|cards)\s*\n/gm, "")
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
    const prepared = prepare(body);
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
  const sectionIndex = (id) => SECTIONS.findIndex((s) => s.id === id);
  return pages.sort((a, b) => sectionIndex(a.section) - sectionIndex(b.section) || a.order - b.order || a.path.localeCompare(b.path));
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
