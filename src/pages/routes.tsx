import type { ReactElement } from "react";
import { FAQ, ORIGIN, SITE } from "../site";
import { MORE_FAQ, PAGES, UPDATED, type Page } from "./content";
import { FaqPage, GuidePage, GuidesHub } from "./GuidePage";

/** A page other than home: its address, words for search results, structured data, and what it shows. */
export interface Route {
  path: string;
  title: string;
  description: string;
  /** schema.org objects for this page (added to the @graph). */
  ld: object[];
  element: () => ReactElement;
}

const url = (path: string) => `${ORIGIN}${path}`;

const crumbs = (items: [string, string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: url(path) })),
});

const faqLd = (items: { q: string; a: string }[], path: string) => ({
  "@type": "FAQPage",
  "@id": `${url(path)}#faq`,
  mainEntity: items.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

function pageLd(p: Page): object[] {
  const path = `/${p.slug}`;
  const out: object[] = [
    {
      "@type": p.kind === "howto" ? "WebPage" : "Article",
      "@id": `${url(path)}#page`,
      url: url(path),
      headline: p.h1,
      name: p.title,
      description: p.description,
      abstract: p.answer,
      inLanguage: "en",
      dateModified: UPDATED,
      isPartOf: { "@id": `${ORIGIN}/#website` },
      about: { "@id": `${ORIGIN}/#app` },
      author: { "@id": `${ORIGIN}/#org` },
      publisher: { "@id": `${ORIGIN}/#org` },
      image: `${ORIGIN}/og-image.png`,
    },
    crumbs([
      ["TodoCity", "/"],
      ["Guides", "/guides"],
      [p.h1, path],
    ]),
  ];
  // Step-by-step pages are HowTos too.
  const steps = p.sections.flatMap((s) => s.blocks).find((b) => "steps" in b);
  if (p.kind === "howto" && steps && "steps" in steps) {
    out.push({
      "@type": "HowTo",
      "@id": `${url(path)}#howto`,
      name: p.h1,
      description: p.answer,
      tool: { "@type": "HowToTool", name: SITE.name },
      step: steps.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s.title, text: s.text, url: `${url(path)}#step-${i + 1}` })),
    });
  }
  if (p.faq?.length) out.push(faqLd(p.faq, path));
  return out;
}

export const ROUTES: Route[] = [
  ...PAGES.map((p) => ({
    path: `/${p.slug}`,
    title: p.title,
    description: p.description,
    ld: pageLd(p),
    element: () => <GuidePage page={p} />,
  })),
  {
    path: "/guides",
    title: "TodoCity Guides: Comparisons, How-Tos and More",
    description: "Guides to TodoCity, the private AI to-do app for Mac: how it compares with Things 3, Todoist and Apple Reminders, and how to move your tasks.",
    ld: [
      {
        "@type": "CollectionPage",
        "@id": `${url("/guides")}#page`,
        url: url("/guides"),
        name: "TodoCity guides",
        isPartOf: { "@id": `${ORIGIN}/#website` },
        hasPart: PAGES.map((p) => ({ "@type": "WebPage", url: url(`/${p.slug}`), name: p.h1 })),
      },
      crumbs([
        ["TodoCity", "/"],
        ["Guides", "/guides"],
      ]),
    ],
    element: () => <GuidesHub />,
  },
  {
    path: "/faq",
    title: "TodoCity FAQ: Price, Privacy, Macs, Sync and Imports",
    description: "Answers about TodoCity, the free private to-do app for Mac: price, on-device AI, offline use, iPhone, sync between Macs, and moving from Things or Todoist.",
    ld: [
      faqLd([...FAQ, ...MORE_FAQ], "/faq"),
      crumbs([
        ["TodoCity", "/"],
        ["Questions", "/faq"],
      ]),
    ],
    element: () => <FaqPage />,
  },
];

export const routeFor = (path: string) => ROUTES.find((r) => r.path === path.replace(/\/+$/, ""));
