import { useEffect, useId, useMemo, useRef, useState } from "react";

/** One page in /docs/search.json (written at build time by scripts/prerender.mjs). */
interface Entry {
  /** path */
  p: string;
  /** title */
  t: string;
  /** section label */
  s: string;
  /** description */
  d: string;
  /** headings: id, heading, text */
  h: { i: string; h: string; x: string }[];
}

interface Hit {
  key: string;
  href: string;
  title: string;
  section: string;
  heading: string | null;
  score: number;
}

let indexPromise: Promise<Entry[]> | null = null;
function loadIndex(): Promise<Entry[]> {
  indexPromise ??= fetch("/docs/search.json")
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => {
      indexPromise = null;
      return [];
    });
  return indexPromise;
}

const words = (q: string) =>
  q
    .toLowerCase()
    .split(/[^\p{L}\p{N}#⌘⇧⌥⌃]+/u)
    .filter(Boolean);
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Pages and headings that contain every word typed (word starts count), best first. */
export function searchDocs(index: Entry[], query: string, max = 8): Hit[] {
  const terms = words(query);
  if (!terms.length) return [];
  const res = terms.map((t) => new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(t)}`, "iu"));
  const count = (re: RegExp, text: string) => (re.test(text) ? 1 : 0);
  const hits: Hit[] = [];
  for (const e of index) {
    let best: Hit | null = null;
    const pageText = `${e.t} ${e.d}`;
    for (const h of e.h.length ? e.h : [{ i: "", h: "", x: "" }]) {
      const all = `${pageText} ${h.h} ${h.x}`;
      if (!res.every((re) => re.test(all))) continue;
      let score = 0;
      for (const re of res) score += count(re, e.t) * 10 + count(re, h.h) * 6 + count(re, e.d) * 2 + count(re, h.x);
      if (!h.i) score += 0.5; // the page itself, when the intro matches as well
      if (!best || score > best.score)
        best = { key: `${e.p}#${h.i}`, href: h.i ? `${e.p}#${h.i}` : e.p, title: e.t, section: e.s, heading: h.h || null, score };
    }
    if (best) hits.push(best);
  }
  return hits.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, max);
}

const typing = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
};

/** The search box in the header: "/" focuses it, Esc closes it, Enter opens the top result. */
export function DocsSearch() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<Entry[] | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const listId = useId();

  const hits = useMemo(() => (index ? searchDocs(index, query) : []), [index, query]);
  useEffect(() => setActive(0), [query]);

  // "/" (or ⌘K) from anywhere on the page focuses the box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "/" && !typing(e.target) && !e.metaKey && !e.ctrlKey) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setExpanded(true);
        requestAnimationFrame(() => input.current?.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Clicking elsewhere closes the results.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const prime = () => {
    setOpen(true);
    if (!index) void loadIndex().then(setIndex);
  };
  const close = () => {
    setOpen(false);
    setExpanded(false);
    input.current?.blur();
  };
  const go = (href: string) => {
    window.location.href = href;
  };

  const showList = open && query.trim().length > 0;
  return (
    <div ref={box} className={expanded ? "dx-search open" : "dx-search"} role="search">
      <button type="button" className="dx-search-toggle" aria-label="Search the docs" onClick={() => { setExpanded(true); requestAnimationFrame(() => input.current?.focus()); }}>
        <SearchGlyph />
      </button>
      <div className="dx-search-field">
        <SearchGlyph />
        <input
          ref={input}
          type="search"
          value={query}
          placeholder="Search the docs"
          aria-label="Search the docs"
          role="combobox"
          aria-expanded={showList}
          aria-controls={showList ? listId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={showList && hits[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          onFocus={prime}
          onChange={(e) => {
            setQuery(e.target.value);
            prime();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              if (query) setQuery("");
              close();
            } else if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, Math.max(hits.length - 1, 0)));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && hits[active]) {
              e.preventDefault();
              go(hits[active].href);
            }
          }}
        />
        <kbd className="dx-search-hint" aria-hidden>
          /
        </kbd>
      </div>
      {showList && (
        <div className="dx-results">
          <ul id={listId} role="listbox" aria-label="Search results">
            {hits.map((h, i) => (
              <li key={h.key} id={`${listId}-${i}`} role="option" aria-selected={i === active} className={i === active ? "on" : undefined} onMouseEnter={() => setActive(i)}>
                <a href={h.href} tabIndex={-1}>
                  <span className="dx-result-title">{h.title}</span>
                  <span className="dx-result-sub">
                    {h.section}
                    {h.heading ? ` › ${h.heading}` : ""}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          {index && !hits.length && <p className="dx-results-none">Try another word, like “Todoist”, “repeat” or “shortcut”.</p>}
          {!index && <p className="dx-results-none">Loading the index…</p>}
          {hits.length > 0 && (
            <p className="dx-results-foot" aria-hidden>
              <kbd>↑</kbd> <kbd>↓</kbd> to move · <kbd>Return</kbd> to open · <kbd>Esc</kbd> to close
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SearchGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <circle cx="7" cy="7" r="4.6" />
      <path d="M10.5 10.5 14 14" />
    </svg>
  );
}
