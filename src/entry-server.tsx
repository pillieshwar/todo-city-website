import { renderToString } from "react-dom/server";
import { App } from "./App";
import { ROUTES } from "./pages/routes";
import { MORE_FAQ, PAGES, UPDATED } from "./pages/content";
import { FAQ, ORIGIN, SITE } from "./site";

/**
 * Build-time only (see scripts/prerender.mjs): every page as HTML, so search
 * engines, AI assistants, link previews and visitors without JavaScript get
 * all the words. In the browser, main.tsx renders the live page over it.
 */
export function render(): string {
  return renderToString(<App />);
}

/** The guide pages: their address, head tags, structured data and HTML. */
export function renderPages() {
  return ROUTES.map((r) => ({ path: r.path, title: r.title, description: r.description, ld: r.ld, html: renderToString(r.element()) }));
}

export { FAQ, MORE_FAQ, ORIGIN, PAGES, SITE, UPDATED };
