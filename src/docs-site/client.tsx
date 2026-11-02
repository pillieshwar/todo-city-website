import { StrictMode } from "react";
import type { Root } from "react-dom/client";
import { loaders } from "virtual:docs";
import { DocsNotFound, DocsPage } from "./DocsLayout";
import { docFor } from "./model";

/** Renders the docs page at `path` (or the friendly not-found page) over the prerendered HTML. */
export async function mountDocs(root: Root, path: string) {
  const meta = docFor(path);
  const load = meta ? loaders[meta.path] : undefined;
  if (!meta || !load) {
    root.render(
      <StrictMode>
        <DocsNotFound />
      </StrictMode>,
    );
    return;
  }
  const body = (await load()).default;
  root.render(
    <StrictMode>
      <DocsPage meta={meta} body={body} />
    </StrictMode>,
  );
}
