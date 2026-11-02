import { DOCS, type DocMeta } from "virtual:docs";
import SECTIONS from "../docs/sections.json";

export type { DocBody, DocHeading, DocMeta } from "virtual:docs";
export { DOCS };

export interface Section {
  id: string;
  label: string;
  blurb: string;
}
export const SECTION_LIST: Section[] = SECTIONS;

export const DOCS_REPO = "https://github.com/pillieshwar/todo-city-website";
export const editUrl = (m: DocMeta) => `${DOCS_REPO}/edit/main/${m.file}`;
/** Where the page's raw Markdown is served: /docs/index.md for /docs, else /docs/<path>.md. */
export const markdownUrl = (m: DocMeta) => (m.path === "/docs" ? "/docs/index.md" : `${m.path}.md`);

export const sectionOf = (id: string) => SECTION_LIST.find((s) => s.id === id);
export const pagesIn = (section: string) => DOCS.filter((d) => d.section === section);
export const docFor = (path: string) => DOCS.find((d) => d.path === path.replace(/\/+$/, ""));
/** The page a section's tab opens. */
export const firstPage = (section: string) => pagesIn(section)[0];

/** A page in the sidebar, with the pages under it (like Connectors → Todoist). */
export interface NavItem {
  page: DocMeta;
  children: NavItem[];
}

/** A section's pages as a tree: a page whose path starts with another's sits under it. */
export function navTree(section: string): NavItem[] {
  const pages = pagesIn(section);
  const parentOf = (p: DocMeta) =>
    pages
      .filter((q) => q !== p && q.path !== "/docs" && p.path.startsWith(`${q.path}/`))
      .sort((a, b) => b.path.length - a.path.length)[0];
  const build = (parent: DocMeta | undefined): NavItem[] =>
    pages.filter((p) => parentOf(p) === parent).map((page) => ({ page, children: build(page) }));
  return build(undefined);
}

/** The section's pages in reading order (each page, then the pages under it). */
export function readingOrder(section: string): DocMeta[] {
  const flat = (items: NavItem[]): DocMeta[] => items.flatMap((i) => [i.page, ...flat(i.children)]);
  return flat(navTree(section));
}

export function neighbours(m: DocMeta): { prev?: DocMeta; next?: DocMeta } {
  const order = readingOrder(m.section);
  const i = order.findIndex((p) => p.path === m.path);
  return { prev: i > 0 ? order[i - 1] : undefined, next: i >= 0 ? order[i + 1] : undefined };
}

/** Docs / Connectors / Todoist: label and link (null for the page itself). */
export function crumbs(m: DocMeta): [string, string | null][] {
  if (m.path === "/docs") return [["Docs", null]];
  const section = sectionOf(m.section);
  const first = firstPage(m.section);
  const out: [string, string | null][] = [["Docs", "/docs"]];
  if (first?.path === m.path) {
    out.push([section?.label ?? m.nav, null]);
    return out;
  }
  if (section && first) out.push([section.label, first.path]);
  const parent = pagesIn(m.section)
    .filter((q) => q.path !== first?.path && m.path.startsWith(`${q.path}/`))
    .sort((a, b) => b.path.length - a.path.length)[0];
  if (parent) out.push([parent.nav, parent.path]);
  out.push([m.nav, null]);
  return out;
}

export function formatDay(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}
