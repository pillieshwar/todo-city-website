// After `vite build`: put the rendered page into dist/index.html, add the
// FAQ as structured data, and write a sitemap dated today.
import { readFile, rm, writeFile } from "node:fs/promises";

const server = await import(new URL("../dist-server/entry-server.js", import.meta.url));
const html = server.render();
if (!html.includes("<main")) throw new Error("prerender: the page rendered without its content");

const faq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: server.FAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const file = new URL("../dist/index.html", import.meta.url);
let page = await readFile(file, "utf8");
if (!page.includes('<div id="root"></div>')) throw new Error("prerender: no empty #root in dist/index.html");
page = page
  .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  .replace(
    "</head>",
    `  <script type="application/ld+json">${JSON.stringify(faq).replace(/</g, "\\u003c")}</script>\n` +
      // Without JavaScript, nothing waits to fade in.
      `    <noscript><style>.reveal{opacity:1;transform:none;filter:none}</style></noscript>\n  </head>`,
  );
await writeFile(file, page);

const today = new Date().toISOString().slice(0, 10);
await writeFile(
  new URL("../dist/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${server.ORIGIN}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
    <image:image>
      <image:loc>${server.ORIGIN}/og-image.png</image:loc>
    </image:image>
  </url>
</urlset>
`,
);
await rm(new URL("../dist-server", import.meta.url), { recursive: true, force: true });
console.log(`prerendered ${Math.round(html.length / 1024)} KB of HTML, wrote sitemap.xml (${today})`);
