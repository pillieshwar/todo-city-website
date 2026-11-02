import { useEffect, useRef, useState, type ReactNode } from "react";
import { AppleIcon, Logo } from "../components/Icons";
import { SITE } from "../site";
import {
  SECTION_LIST,
  crumbs,
  editUrl,
  firstPage,
  formatDay,
  markdownUrl,
  navTree,
  neighbours,
  sectionOf,
  type DocBody,
  type DocMeta,
  type NavItem,
} from "./model";
import { DocsSearch } from "./Search";

const SIDEBAR_KEY = "todocity-docs-sidebar";
function readSidebar(): boolean {
  try {
    return localStorage.getItem(SIDEBAR_KEY) !== "closed";
  } catch {
    return true;
  }
}
function saveSidebar(open: boolean) {
  try {
    localStorage.setItem(SIDEBAR_KEY, open ? "open" : "closed");
  } catch {
    // Storage unavailable: the choice lasts until the page changes.
  }
}

/** The frame every docs page shares: header, section tabs, sidebar (a drawer on phones) and the main column. */
function Shell({ section, current, children, aside }: { section: string | null; current: string | null; children: ReactNode; aside?: ReactNode }) {
  const [sidebar, setSidebar] = useState(true);
  const [drawer, setDrawer] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  useEffect(() => setSidebar(readSidebar()), []);
  // Esc closes the drawer; focus moves into it when it opens and back when it closes.
  useEffect(() => {
    if (!drawer) return;
    const first = drawerRef.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawer(false);
        menuRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("dx-locked");
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.classList.remove("dx-locked");
    };
  }, [drawer]);
  const toggleSidebar = () => {
    setSidebar((s) => {
      saveSidebar(!s);
      return !s;
    });
  };

  return (
    <div className={["dx", sidebar ? "" : "dx-folded", section ? "" : "dx-nosection"].filter(Boolean).join(" ")}>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="dx-header">
        <div className="dx-header-row">
          <button
            ref={menuRef}
            type="button"
            className="dx-menu"
            aria-label="Docs menu"
            aria-expanded={drawer}
            aria-controls="dx-drawer"
            onClick={() => setDrawer((d) => !d)}
          >
            <span />
            <span />
            <span />
          </button>
          <a href="/docs" className="dx-brand" aria-label="TodoCity Docs home">
            <Logo size={26} />
            <span className="dx-brand-name">TodoCity</span>
            <span className="dx-brand-docs">Docs</span>
          </a>
          <DocsSearch />
          <div className="dx-header-end">
            <ThemeSwitch />
            <a className="dx-back" href="/">
              todocity.app
            </a>
            <a className="btn btn-primary btn-sm dx-dl" href={SITE.download} aria-label="Download TodoCity for Mac">
              <AppleIcon /> <span className="dx-dl-text">Download</span>
            </a>
          </div>
        </div>
        <nav className="dx-tabs" aria-label="Docs sections">
          <ul>
            {SECTION_LIST.map((s) => {
              const first = firstPage(s.id);
              if (!first) return null;
              const on = s.id === section;
              return (
                <li key={s.id}>
                  <a href={first.path} className={on ? "on" : undefined} aria-current={on ? "true" : undefined}>
                    {s.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      <div className="dx-body">
        <aside className="dx-sidebar" aria-label="Pages in this section">
          <div className="dx-sidebar-inner">
            <button type="button" className="dx-fold" onClick={toggleSidebar} aria-expanded={sidebar} aria-label={sidebar ? "Hide the sidebar" : "Show the sidebar"} title={sidebar ? "Hide the sidebar" : "Show the sidebar"}>
              <span aria-hidden>{sidebar ? "⇤" : "⇥"}</span>
            </button>
            {sidebar && section && <SectionNav section={section} current={current} />}
          </div>
        </aside>

        <div id="dx-drawer" ref={drawerRef} className={drawer ? "dx-drawer open" : "dx-drawer"} hidden={!drawer} role="dialog" aria-modal="true" aria-label="Docs pages">
          <div className="dx-drawer-panel">
            <div className="dx-drawer-head">
              <span>Docs</span>
              <button type="button" className="dx-drawer-close" aria-label="Close the menu" onClick={() => { setDrawer(false); menuRef.current?.focus(); }}>
                ×
              </button>
            </div>
            {section && <SectionNav section={section} current={current} />}
            <nav className="dx-drawer-sections" aria-label="All sections">
              <p className="dx-nav-head">All sections</p>
              <ul>
                {SECTION_LIST.map((s) => {
                  const first = firstPage(s.id);
                  return first ? (
                    <li key={s.id}>
                      <a href={first.path} aria-current={s.id === section ? "true" : undefined}>
                        {s.label}
                      </a>
                    </li>
                  ) : null;
                })}
              </ul>
              <a className="dx-drawer-home" href="/">
                Back to todocity.app
              </a>
            </nav>
          </div>
          <div className="dx-drawer-scrim" aria-hidden onClick={() => setDrawer(false)} />
        </div>

        <main id="main" tabIndex={-1} className="dx-main">
          {children}
        </main>
        {aside}
      </div>
    </div>
  );
}

function SectionNav({ section, current }: { section: string; current: string | null }) {
  const label = sectionOf(section)?.label ?? "";
  return (
    <nav className="dx-nav" aria-label={label}>
      <p className="dx-nav-head">{label}</p>
      <NavList items={navTree(section)} current={current} />
    </nav>
  );
}

function NavList({ items, current }: { items: NavItem[]; current: string | null }) {
  return (
    <ul>
      {items.map((item) => (
        <NavEntry key={item.page.path} item={item} current={current} />
      ))}
    </ul>
  );
}

function NavEntry({ item, current }: { item: NavItem; current: string | null }) {
  const [open, setOpen] = useState(true);
  const on = item.page.path === current;
  const link = (
    <a href={item.page.path} className={on ? "on" : undefined} aria-current={on ? "page" : undefined}>
      {item.page.nav}
    </a>
  );
  if (!item.children.length) return <li>{link}</li>;
  const id = `dx-group-${item.page.path.replace(/[^a-z0-9]+/gi, "-")}`;
  return (
    <li className="dx-group">
      <div className="dx-group-row">
        {link}
        <button type="button" className="dx-group-toggle" aria-expanded={open} aria-controls={id} aria-label={`${open ? "Hide" : "Show"} pages under ${item.page.nav}`} onClick={() => setOpen((o) => !o)}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M3 4.5 6 7.5l3-3" />
          </svg>
        </button>
      </div>
      <div id={id} hidden={!open}>
        <NavList items={item.children} current={current} />
      </div>
    </li>
  );
}

/** "On this page": the H2s, with the one in view highlighted. */
function OnThisPage({ meta }: { meta: DocMeta }) {
  const items = meta.headings.filter((h) => h.depth === 2);
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    if (!items.length) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.28;
        let id = items[0].id;
        for (const h of items) {
          const el = document.getElementById(h.id);
          if (el && el.getBoundingClientRect().top <= line) id = h.id;
        }
        // At the very bottom, the last heading is the one being read.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) id = items[items.length - 1].id;
        setActive(id);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, [meta.path]);
  if (!items.length) return <div className="dx-toc" aria-hidden />;
  return (
    <nav className="dx-toc" aria-label="On this page">
      <p className="dx-nav-head">On this page</p>
      <ul>
        {items.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className={h.id === active ? "on" : undefined} aria-current={h.id === active ? "location" : undefined}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Crumbs({ items }: { items: [string, string | null][] }) {
  return (
    <nav className="dx-crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map(([label, href], i) => (
          <li key={`${label}-${i}`}>
            {href ? <a href={href}>{label}</a> : <span aria-current="page">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

function PageActions({ meta, body }: { meta: DocMeta; body: DocBody }) {
  const [note, setNote] = useState("");
  useEffect(() => {
    if (!note) return;
    const t = window.setTimeout(() => setNote(""), 2400);
    return () => window.clearTimeout(t);
  }, [note]);
  return (
    <div className="dx-actions">
      <button type="button" className="dx-action" onClick={() => void copyText(body.md).then((ok) => setNote(ok ? "Copied as Markdown" : "Select the text and copy it instead"))}>
        <CopyGlyph /> {note === "Copied as Markdown" ? "Copied" : "Copy for LLM"}
      </button>
      <a className="dx-action" href={markdownUrl(meta)} target="_blank" rel="noreferrer">
        <DocGlyph /> View as Markdown
      </a>
      <a className="dx-action" href={editUrl(meta)} target="_blank" rel="noreferrer">
        <PenGlyph /> Edit on GitHub
      </a>
      <span className="sr-only" role="status" aria-live="polite">
        {note}
      </span>
    </div>
  );
}

type Theme = "system" | "light" | "dark";
const THEME_KEY = "todocity-docs-theme";
const THEMES: { id: Theme; label: string; d: string }[] = [
  { id: "system", label: "Match my Mac", d: "M2.5 3.5h11v7h-11zM6 13.5h4M8 10.5v3" },
  { id: "light", label: "Light", d: "M8 5.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zM8 1.5v1.3M8 13.2v1.3M1.5 8h1.3M13.2 8h1.3M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" },
  { id: "dark", label: "Dark", d: "M13 9.6A5.5 5.5 0 0 1 6.4 3a5.5 5.5 0 1 0 6.6 6.6z" },
];

/**
 * Match my Mac · Light · Dark. Dark is the default, like the app. The choice is
 * kept in this browser only and applied before the page paints (prerender.mjs).
 */
function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    if (t === "system" || t === "light" || t === "dark") setTheme(t);
  }, []);
  const pick = (t: Theme) => {
    setTheme(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      // Storage unavailable: the choice lasts until the page changes.
    }
  };
  return (
    <div className="dx-theme" role="group" aria-label="Theme">
      {THEMES.map((t) => (
        <button key={t.id} type="button" aria-label={t.label} title={t.label} aria-pressed={theme === t.id} onClick={() => pick(t.id)}>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d={t.d} />
          </svg>
        </button>
      ))}
    </div>
  );
}

/** One docs page. */
export function DocsPage({ meta, body }: { meta: DocMeta; body: DocBody }) {
  const { prev, next } = neighbours(meta);
  return (
    <Shell section={meta.section} current={meta.path} aside={<OnThisPage meta={meta} />}>
      <article className="dx-article">
        <Crumbs items={crumbs(meta)} />
        <h1 className="dx-title">{meta.title}</h1>
        <p className="dx-subtitle">{meta.description}</p>
        <PageActions meta={meta} body={body} />
        <div className="dx-content" dangerouslySetInnerHTML={{ __html: body.html }} />
      </article>
      <footer className="dx-page-foot">
        {(prev || next) && (
          <nav className="dx-pager" aria-label="Previous and next pages">
            {prev ? (
              <a className="dx-pager-prev" href={prev.path} rel="prev">
                <span className="dx-pager-label">Previous</span>
                <span className="dx-pager-title">{prev.nav}</span>
              </a>
            ) : (
              <span />
            )}
            {next && (
              <a className="dx-pager-next" href={next.path} rel="next">
                <span className="dx-pager-label">Next</span>
                <span className="dx-pager-title">{next.nav}</span>
              </a>
            )}
          </nav>
        )}
        <p className="dx-updated">
          Last updated <time dateTime={meta.updated}>{formatDay(meta.updated)}</time> ·{" "}
          <a href={editUrl(meta)} target="_blank" rel="noreferrer">
            Suggest a change
          </a>
        </p>
      </footer>
    </Shell>
  );
}

/** Any /docs/… address with no page: a calm way back. */
export function DocsNotFound() {
  return (
    <Shell section={null} current={null}>
      <article className="dx-article">
        <Crumbs items={[["Docs", "/docs"], ["Page not found", null]]} />
        <h1 className="dx-title">Let's find that page</h1>
        <p className="dx-subtitle">This address has no page in TodoCity Docs. Search above, or start from one of the sections below.</p>
        <div className="dx-content">
          <ul className="dx-links">
            {SECTION_LIST.map((s) => {
              const first = firstPage(s.id);
              return first ? (
                <li key={s.id}>
                  <a className="dx-link" href={first.path}>
                    <span className="dx-link-body">
                      <span className="dx-link-title">{s.label}</span>
                      <span className="dx-link-text">{s.blurb}</span>
                    </span>
                  </a>
                </li>
              ) : null;
            })}
          </ul>
          <p>
            <a href="/docs">Docs home</a> · <a href="/">todocity.app</a>
          </p>
        </div>
      </article>
    </Shell>
  );
}

function CopyGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.6" />
      <path d="M10.5 3.5v-.4A1.1 1.1 0 0 0 9.4 2H3.1A1.1 1.1 0 0 0 2 3.1v6.3a1.1 1.1 0 0 0 1.1 1.1h.4" />
    </svg>
  );
}
function DocGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="M4 1.8h5.4L12.5 5v9.2H4Z" />
      <path d="M9.2 1.9V5.2h3.2M6 8.5h4.5M6 11h3" />
    </svg>
  );
}
function PenGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden>
      <path d="M10.8 2.6 13.4 5.2 6 12.6l-3.3.7.7-3.3Z" />
    </svg>
  );
}
