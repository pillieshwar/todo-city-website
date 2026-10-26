# Todo City website

The Todo City website: the Lights On story told as you scroll, a living 3D city you can turn and explore, a playground where visitors put up their own buildings and light them up, and the Mac download.

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

## Notes

- three.js loads in its own chunk after the page text, and each city only draws while it's on screen.
- On touch screens the hero city turns by itself so it never traps the page's scrolling; the playground city can be turned with a finger.
- With *Reduce motion* on, the city stays still and the page skips its animations.

## Search and sharing

- `npm run build` renders the whole page to HTML at build time (`src/entry-server.tsx`, `scripts/prerender.mjs`), so search engines, link previews and visitors without JavaScript get every word. It also adds the FAQ as structured data and writes `sitemap.xml` dated that day.
- `index.html` has the title, description, canonical URL, Open Graph and X cards, and `SoftwareApplication` structured data. `public/` has `robots.txt`, the web manifest, icons and the 1200×630 sharing image.
- After the first deploy on the real domain, add `https://todocity.app/sitemap.xml` in Google Search Console (Sitemaps) and request indexing of the home page.

## Accessibility

Aimed at WCAG 2.2 AA: a skip link, landmarks and a heading order, visible focus on everything, text at 4.5:1 contrast or more, labels for every control, the 3D cities described for screen readers, a phone menu that's closed to keyboards when hidden (Escape closes it), announcements in the playground, and no moving demos or camera flights when the system asks for reduced motion.
