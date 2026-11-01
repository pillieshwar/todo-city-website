import { renderToString } from "react-dom/server";
import { App } from "./App";
import { CityPage } from "./CityPage";
import { ROUTES } from "./pages/routes";
import { MORE_FAQ, PAGES, UPDATED } from "./pages/content";
import { CITY, FAQ, ORIGIN, SITE } from "./site";

/**
 * Build-time only (see scripts/prerender.mjs): every page as HTML, so search
 * engines, AI assistants, link previews and visitors without JavaScript get
 * all the words. In the browser, main.tsx renders the live page over it.
 */
export function render(): string {
  return renderToString(<App />);
}

/** The city page and the guide pages: their address, head tags, structured data and HTML. */
export function renderPages() {
  const city = {
    path: CITY.path,
    title: CITY.title,
    description: CITY.description,
    ld: [
      {
        "@type": "WebPage",
        "@id": `${ORIGIN}${CITY.path}#page`,
        url: `${ORIGIN}${CITY.path}`,
        name: CITY.title,
        description: CITY.description,
        inLanguage: "en",
        isPartOf: { "@id": `${ORIGIN}/#website` },
        about: { "@id": `${ORIGIN}/#app` },
        image: `${ORIGIN}/og-image.png`,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "TodoCity", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Your city", item: `${ORIGIN}${CITY.path}` },
        ],
      },
    ],
    html: renderToString(<CityPage />),
  };
  return [city, ...ROUTES.map((r) => ({ path: r.path, title: r.title, description: r.description, ld: r.ld, html: renderToString(r.element()) }))];
}

export { FAQ, MORE_FAQ, ORIGIN, PAGES, SITE, UPDATED };
