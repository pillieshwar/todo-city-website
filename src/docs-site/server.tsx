import { renderToString } from "react-dom/server";
import { DOCS, loaders } from "virtual:docs";
import { DocsNotFound, DocsPage } from "./DocsLayout";
import { SECTION_LIST, crumbs, sectionOf } from "./model";

const ORIGIN = "https://todocity.app";

/**
 * Build-time only (scripts/prerender.mjs): every docs page as HTML with its
 * head tags and structured data, its Markdown, and its words for search.
 */
export async function renderDocs() {
  const out: object[] = [];
  for (const meta of DOCS) {
    const body = (await loaders[meta.path]()).default;
    const url = `${ORIGIN}${meta.path}`;
    const trail = crumbs(meta).map(([name, href]) => ({ name, path: href ?? meta.path }));
    out.push({
      path: meta.path,
      title: meta.path === "/docs" ? "TodoCity Docs: How to Use TodoCity for Mac" : `${meta.title} · TodoCity Docs`,
      description: meta.description,
      section: sectionOf(meta.section)?.label ?? "",
      updated: meta.updated,
      md: body.md,
      ld: [
        {
          "@type": "TechArticle",
          "@id": `${url}#page`,
          url,
          headline: meta.title,
          description: meta.description,
          inLanguage: "en",
          dateModified: meta.updated,
          isPartOf: { "@id": `${ORIGIN}/#website` },
          about: { "@id": `${ORIGIN}/#app` },
          author: { "@id": `${ORIGIN}/#org` },
          publisher: { "@id": `${ORIGIN}/#org` },
          image: `${ORIGIN}/og-image.png`,
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [{ name: "TodoCity", path: "" }, ...trail].map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `${ORIGIN}${c.path || "/"}`,
          })),
        },
      ],
      html: renderToString(<DocsPage meta={meta} body={body} />),
    });
  }
  return out;
}

/** The page for any address that isn't on the site (served as 404.html). */
export function renderNotFound() {
  return renderToString(<DocsNotFound />);
}

export { DOCS, SECTION_LIST };
