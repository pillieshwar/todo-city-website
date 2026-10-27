// After `vite build`: put the rendered pages into dist (the home page into
// dist/index.html, each guide into dist/<slug>/index.html with its own head),
// add structured data, and write sitemap.xml, llms.txt and llms-full.txt.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const server = await import(new URL("../dist-server/entry-server.js", import.meta.url));
const { ORIGIN, SITE, FAQ, MORE_FAQ, PAGES, UPDATED } = server;
const html = server.render();
if (!html.includes("<main")) throw new Error("prerender: the page rendered without its content");

const json = (o) => JSON.stringify(o).replace(/</g, "\\u003c");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// Without JavaScript, nothing waits to fade in.
const noscript = `    <noscript><style>.reveal{opacity:1;transform:none;filter:none}</style></noscript>\n  </head>`;

const file = new URL("../dist/index.html", import.meta.url);
const template = await readFile(file, "utf8");
if (!template.includes('<div id="root"></div>')) throw new Error("prerender: no empty #root in dist/index.html");

// ── Home ───────────────────────────────────────────────────────────────────
const faq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
};
await writeFile(
  file,
  template
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
    .replace("</head>", `  <script type="application/ld+json">${json(faq)}</script>\n${noscript}`),
);

// ── Guides ─────────────────────────────────────────────────────────────────
/** Swap one tag's attribute value, and fail loudly if the tag isn't there. */
function swap(page, pattern, value, what) {
  if (!pattern.test(page)) throw new Error(`prerender: no ${what} in the template`);
  return page.replace(pattern, (m, a, _old, b) => `${a}${value}${b}`);
}
const pages = server.renderPages();
for (const p of pages) {
  const url = `${ORIGIN}${p.path}`;
  let page = template;
  page = swap(page, /(<title>)([^<]*)(<\/title>)/, esc(p.title), "title");
  page = swap(page, /(<meta name="description" content=")([^"]*)(")/, esc(p.description), "description");
  page = swap(page, /(<link rel="canonical" href=")([^"]*)(")/, url, "canonical");
  page = swap(page, /(<meta property="og:url" content=")([^"]*)(")/, url, "og:url");
  page = swap(page, /(<meta property="og:type" content=")([^"]*)(")/, "article", "og:type");
  page = swap(page, /(<meta property="og:title" content=")([^"]*)(")/, esc(p.title), "og:title");
  page = swap(page, /(<meta property="og:description" content=")([^"]*)(")/, esc(p.description), "og:description");
  page = swap(page, /(<meta name="twitter:title" content=")([^"]*)(")/, esc(p.title), "twitter:title");
  page = swap(page, /(<meta name="twitter:description" content=")([^"]*)(")/, esc(p.description), "twitter:description");
  page = page
    .replace('<div id="root"></div>', `<div id="root">${p.html}</div>`)
    .replace("</head>", `  <script type="application/ld+json">${json({ "@context": "https://schema.org", "@graph": p.ld })}</script>\n${noscript}`);
  const dir = new URL(`../dist${p.path}/`, import.meta.url);
  await mkdir(dir, { recursive: true });
  await writeFile(new URL("index.html", dir), page);
}

// ── Sitemap ────────────────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const entry = (path, lastmod, priority, image = false) => `  <url>
    <loc>${ORIGIN}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>${
      image
        ? `
    <image:image>
      <image:loc>${ORIGIN}/og-image.png</image:loc>
    </image:image>`
        : ""
    }
  </url>`;
await writeFile(
  new URL("../dist/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${[entry("/", today, "1.0", true), ...pages.map((p) => entry(p.path, UPDATED, p.path === "/guides" || p.path === "/faq" ? "0.7" : "0.8"))].join("\n")}
</urlset>
`,
);

// ── llms.txt: a plain summary for AI assistants (llmstxt.org) ──────────────
const facts = [
  "TodoCity is a free to-do app for Mac (macOS 11 or later, Apple silicon and Intel).",
  "It turns any copied or selected text into a dated task: copy text and press ⌘C again. A small AI model runs on the Mac itself; nothing captured is sent to a cloud AI.",
  "Phrases like “by Friday 3pm” become a day, time and deadline; “every Sunday” a repeat.",
  "Tasks are stored locally in one SQLite file. No account, no cloud, no analytics.",
  "Optional sync between a person's Macs: paired with a code, end-to-end encrypted (ChaCha20-Poly1305), no iCloud or account.",
  "Views: Today with its hours, a week calendar, Anytime, Someday, Overdue, Logbook; projects with sections (floors), sub-tasks, deadlines, repeats, tags.",
  "Modes (Work, Personal, custom) show only chosen projects on each Mac.",
  "Imports from Things 3 and Todoist. Two-way Apple Reminders sync. Calendar shown beside tasks.",
  "Every project is a building and every finished task lights a window in the user's own 3D city; milestones, no streaks or penalties.",
  "Free for personal, non-commercial use (PolyForm Noncommercial); source code on GitHub. No iPhone, iPad, Windows or web app.",
];
const link = (p) => `- [${p.h1}](${ORIGIN}/${p.slug}): ${p.description}`;
const kinds = [
  ["Comparisons", "compare"],
  ["How-tos", "howto"],
  ["Guides", "guide"],
];
const llms = `# ${SITE.name}

> A private to-do app for Mac. On-device AI turns any text into a dated task, and every task you finish lights a window in your own 3D city. Free, no account.

${facts.map((f) => `- ${f}`).join("\n")}

${kinds.map(([label, kind]) => `## ${label}\n\n${PAGES.filter((p) => p.kind === kind).map(link).join("\n")}`).join("\n\n")}

## More

- [Frequently asked questions](${ORIGIN}/faq): price, privacy, offline use, iPhone, sync, imports
- [Download for Mac](${SITE.download}): the latest .dmg
- [Source code and release notes](${SITE.repo})
- [Full text of every guide](${ORIGIN}/llms-full.txt)
`;
await writeFile(new URL("../dist/llms.txt", import.meta.url), llms);

const blockText = (b) =>
  "p" in b
    ? b.p
    : "note" in b
      ? `Note: ${b.note}`
      : "list" in b
        ? b.list.map((x) => `- ${x}`).join("\n")
        : "steps" in b
          ? b.steps.map((s, i) => `${i + 1}. **${s.title}.** ${s.text}`).join("\n")
          : [`| ${b.table.head.join(" | ")} |`, `| ${b.table.head.map(() => "---").join(" | ")} |`, ...b.table.rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
const full = `# ${SITE.name} — every guide, in full

Source: ${ORIGIN} · updated ${UPDATED}

${facts.map((f) => `- ${f}`).join("\n")}

${PAGES.map(
  (p) => `---

# ${p.h1}

URL: ${ORIGIN}/${p.slug}

${p.answer}

${p.sections.map((s) => `## ${s.h2}\n\n${s.blocks.map(blockText).join("\n\n")}`).join("\n\n")}${
    p.faq?.length ? `\n\n## Questions\n\n${p.faq.map((f) => `**${f.q}**\n${f.a}`).join("\n\n")}` : ""
  }`,
).join("\n\n")}

---

# Frequently asked questions

${[...FAQ, ...MORE_FAQ].map((f) => `**${f.q}**\n${f.a}`).join("\n\n")}
`;
await writeFile(new URL("../dist/llms-full.txt", import.meta.url), full);

await rm(new URL("../dist-server", import.meta.url), { recursive: true, force: true });
console.log(`prerendered ${Math.round(html.length / 1024)} KB of HTML and ${pages.length} guide pages, wrote sitemap.xml and llms.txt (${today})`);
