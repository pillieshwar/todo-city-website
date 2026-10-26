import { renderToString } from "react-dom/server";
import { App } from "./App";
import { FAQ, ORIGIN } from "./site";

/**
 * Build-time only (see scripts/prerender.mjs): the page as HTML, so search
 * engines, link previews and visitors without JavaScript get all the words.
 * In the browser, main.tsx renders the live page over it.
 */
export function render(): string {
  return renderToString(<App />);
}

export { FAQ, ORIGIN };
