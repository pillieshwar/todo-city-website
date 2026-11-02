# TodoCity website

The TodoCity website: the Lights On story told as you scroll, a living 3D city you can turn and explore, a playground where visitors put up their own buildings and light them up, and the Mac download.

Built with React 18, TypeScript, Vite and three.js. No other runtime dependencies.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check, build to dist/, then prerender the page and write sitemap.xml
npm run preview    # serve the build
```

## Deploy to Vercel

Import the folder as a project (or run `vercel` in it). `vercel.json` sets the Vite build, `dist/` as the output, long-lived caching for hashed assets, and a few security headers. No environment variables are needed.

## What's where

| Path | What it is |
| --- | --- |
| `src/city/engine.ts` | The 3D city: towers with floors of windows, houses, parks, traffic, bloom, hover and click, camera glides, and windows that flare on when someone moves in. |
| `src/city/layout.ts` | What's built where: the big city in the hero (seeded, so it's the same every visit) and the helpers the playground uses. |
| `src/components/Hero.tsx` | The opening city, where people keep moving in, with a live population count. |
| `src/components/Story.tsx` | Six chapters; each one flies the camera somewhere and changes the city. |
| `src/components/Playground.tsx` | Start a project, add tasks on floors, tick them off — on the edge of a full city. |
| `src/components/Sections.tsx` | Features (with small animated demos), privacy, download and the footer. |
| `src/site.ts` | Download and GitHub links. |
| `src/docs/` | TodoCity Docs (`/docs/…`): one Markdown file per page, the sections, and the release notes. How to write a page: `src/docs/README.md`. |
| `src/docs-site/` | The docs layout (header, section tabs, sidebar, “On this page”), client-side search, and the docs' prerender. |
| `scripts/docs-content.mjs` | Builds the docs at build time: Markdown to HTML (with `marked`, a build-time dependency), headings, search words and the Vite plugin. |

## Notes

- three.js loads in its own chunk after the page text, and each city only draws while it's on screen.
- On touch screens the hero city turns by itself so it never traps the page's scrolling; the playground city can be turned with a finger.
- With *Reduce motion* on, the city stays still and the page skips its animations.

## Search and sharing

- `npm run build` renders the whole page to HTML at build time (`src/entry-server.tsx`, `scripts/prerender.mjs`), so search engines, link previews and visitors without JavaScript get every word. It also adds the FAQ as structured data and writes `sitemap.xml` dated that day.
- `index.html` has the title, description, canonical URL, Open Graph and X cards, and `SoftwareApplication` structured data. `public/` has `robots.txt`, the web manifest, icons and the 1200×630 sharing image.
- After the first deploy on the real domain, add `https://todocity.app/sitemap.xml` in Google Search Console (Sitemaps) and request indexing of the home page.

## Docs

`todocity.app/docs` is the user documentation, one page per feature. Each page is prerendered to HTML with its own title, description and canonical URL, served as raw Markdown at its address plus `.md`, listed in the sitemap and `llms.txt`, and found by a search box that runs in the browser (the index is `/docs/search.json`, built with the site). Docs follow the visitor's light or dark setting. Unknown addresses get `404.html`, a page that leads back to the docs.

- Write or change a page in `src/docs/` (see its README) and run `npm run dev`.
- After each app release, refresh the release notes: `npm run docs:release-notes`.
- `docs.todocity.app` redirects to `todocity.app/docs` (`vercel.json`) once that domain is added to the Vercel project.

## Accessibility

Aimed at WCAG 2.2 AA: a skip link, landmarks and a heading order, visible focus on everything, text at 4.5:1 contrast or more, labels for every control, the 3D cities described for screen readers, a phone menu that's closed to keyboards when hidden (Escape closes it), announcements in the playground, and no moving demos or camera flights when the system asks for reduced motion.
