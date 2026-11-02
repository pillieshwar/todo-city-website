// The docs pages, served at build time by the plugin in scripts/docs-content.mjs.
declare module "virtual:docs" {
  export interface DocHeading {
    depth: number;
    id: string;
    text: string;
  }
  /** One page's details (its body loads separately). */
  export interface DocMeta {
    /** "/docs/connectors/todoist" */
    path: string;
    /** "src/docs/connectors/todoist.md" */
    file: string;
    title: string;
    /** The shorter name used in the sidebar and breadcrumb. */
    nav: string;
    description: string;
    /** An id from src/docs/sections.json. */
    section: string;
    order: number;
    /** "YYYY-MM-DD", from git. */
    updated: string;
    headings: DocHeading[];
  }
  export interface DocBody {
    html: string;
    /** The page as Markdown (for "View as Markdown" and "Copy for LLM"). */
    md: string;
  }
  /** Every page, in sidebar order. */
  export const DOCS: DocMeta[];
  /** Loads one page's body, by path ("/docs/capture"). */
  export const loaders: Record<string, () => Promise<{ default: DocBody }>>;
}
