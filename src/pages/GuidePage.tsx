import type { ReactNode } from "react";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Sections";
import { AppleIcon, Arrow, Logo } from "../components/Icons";
import { FAQ, SITE } from "../site";
import { MORE_FAQ, PAGES, UPDATED, bySlug, type Block, type Page } from "./content";

const KIND: Record<Page["kind"], string> = { guide: "Guide", compare: "Comparison", howto: "How-to" };

/** The TodoCity Docs page with the full details for each guide. */
const DOCS_FOR: Record<string, [string, string, string]> = {
  "private-todo-app-for-mac": ["/docs/privacy", "Privacy", "What stays on your Mac, and what leaves only when you turn it on, feature by feature."],
  "ai-todo-app-on-device": ["/docs/ai-models", "AI models on your Mac", "The models TodoCity offers, how to add or switch one, and how it uses memory."],
  "ai-agents-mcp-todo-app": ["/docs/agents", "AI agents", "Connect Claude Code, Codex, Cursor and more; add-only by default, Full access when you turn it on."],
  "turn-text-into-tasks": ["/docs/capture", "Capture text from any app", "⌘C twice, the capture shortcut, right-click and Quick Add, step by step."],
  "things-3-alternative": ["/docs/connectors/things", "Things 3", "Move in from Things 3, keep it in sync, and what goes where."],
  "todoist-alternative": ["/docs/connectors/todoist", "Todoist", "Connect Todoist, two-way sync, and exactly what goes back to Todoist."],
  "apple-reminders-alternative": ["/docs/connectors/apple-reminders", "Apple Reminders", "Two-way sync with Reminders, and your tasks on your iPhone."],
  "move-from-things-3": ["/docs/connectors/things", "Things 3", "Every step of moving in, keeping in sync and finding your library."],
  "move-from-todoist": ["/docs/connectors/todoist", "Todoist", "Every step of connecting, two-way sync, the safety brake and two Macs."],
  "work-and-personal-tasks": ["/docs/modes", "Modes", "Work, Personal and modes of your own, and what each Mac shows."],
  "sync-macs-without-icloud": ["/docs/sync-between-macs", "Sync between your Macs", "Pairing, end-to-end encryption, the relay and Keep on this Mac only."],
  "gamified-todo-app": ["/docs/city", "Your city", "Buildings, floors, residents, milestones and sharing a picture of your city."],
};

/** A link to the matching page in TodoCity Docs. */
function InTheDocs({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <section className="doc-docs" aria-label="In TodoCity Docs">
      <a href={href} className="doc-card">
        <span className="doc-kind">In the docs</span>
        <span className="doc-card-title">{title}</span>
        <span className="doc-card-text">{text}</span>
        <span className="doc-card-go">
          Read the docs <Arrow />
        </span>
      </a>
    </section>
  );
}

/** The frame every guide page shares: the site's bar and footer, a breadcrumb, and the download at the end. */
export function Frame({ crumbs, children }: { crumbs: [string, string | null][]; children: ReactNode }) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav home={false} />
      <main id="main" tabIndex={-1} className="doc">
        <nav className="doc-crumbs" aria-label="Breadcrumb">
          <ol>
            {crumbs.map(([label, href], i) => (
              <li key={label}>
                {href ? <a href={href}>{label}</a> : <span aria-current="page">{label}</span>}
                {i < crumbs.length - 1 && <span aria-hidden> / </span>}
              </li>
            ))}
          </ol>
        </nav>
        {children}
        <DownloadCard />
      </main>
      <Footer home={false} />
    </>
  );
}

function DownloadCard() {
  return (
    <section className="doc-cta" aria-label="Download TodoCity">
      <Logo size={48} />
      <div>
        <p className="doc-cta-title">Try TodoCity, free for Mac</p>
        <p className="doc-cta-sub">{SITE.requirements} · no account</p>
      </div>
      <a className="btn btn-primary doc-cta-btn" href={SITE.download}>
        <AppleIcon /> Download for Mac
      </a>
    </section>
  );
}

function BlockView({ b }: { b: Block }) {
  if ("p" in b) return <p>{b.p}</p>;
  if ("note" in b) return <p className="doc-note">{b.note}</p>;
  if ("list" in b)
    return (
      <ul>
        {b.list.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
    );
  if ("steps" in b)
    return (
      <ol className="doc-steps">
        {b.steps.map((s, i) => (
          <li key={s.title} id={`step-${i + 1}`}>
            <strong>{s.title}.</strong> {s.text}
          </li>
        ))}
      </ol>
    );
  return (
    <div className="doc-table" role="region" aria-label={b.table.caption} tabIndex={0}>
      <table>
        <caption className="sr-only">{b.table.caption}</caption>
        <thead>
          <tr>
            {b.table.head.map((h, i) => (
              <th key={i} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {b.table.rows.map((r) => (
            <tr key={r.join("|")}>
              {r.map((c, i) => (i === 0 ? <th key={i} scope="row">{c}</th> : <td key={i}>{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Questions({ items, title = "Questions" }: { items: { q: string; a: string }[]; title?: string }) {
  return (
    <section className="doc-faq" aria-labelledby="doc-faq-title">
      <h2 id="doc-faq-title">{title}</h2>
      {items.map((f) => (
        <div key={f.q} className="doc-qa">
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </section>
  );
}

function Related({ slugs }: { slugs: string[] }) {
  const pages = slugs.map((s) => (s === "faq" ? null : bySlug(s))).filter((p): p is Page => !!p);
  return (
    <nav className="doc-related" aria-label="Read next">
      <h2>Read next</h2>
      <div className="doc-cards">
        {pages.map((p) => (
          <a key={p.slug} href={`/${p.slug}`} className="doc-card">
            <span className="doc-kind">{KIND[p.kind]}</span>
            <span className="doc-card-title">{p.h1}</span>
            <span className="doc-card-text">{p.card}</span>
          </a>
        ))}
        {slugs.includes("faq") && (
          <a href="/faq" className="doc-card">
            <span className="doc-kind">FAQ</span>
            <span className="doc-card-title">TodoCity questions, answered</span>
            <span className="doc-card-text">Price, privacy, Macs it runs on, iPhone, sync, imports and more.</span>
          </a>
        )}
      </div>
    </nav>
  );
}

const dateLabel = new Date(`${UPDATED}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

/** One guide, comparison or how-to. */
export function GuidePage({ page }: { page: Page }) {
  return (
    <Frame crumbs={[["TodoCity", "/"], ["Guides", "/guides"], [page.h1, null]]}>
      <article className="doc-article">
        <header className="doc-head">
          <p className="eyebrow">{KIND[page.kind]}</p>
          <h1>{page.h1}</h1>
          <p className="doc-answer">{page.answer}</p>
          <p className="doc-meta">
            Updated <time dateTime={UPDATED}>{dateLabel}</time>
          </p>
        </header>
        {page.facts && (
          <dl className="doc-facts">
            {page.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}
        {page.sections.map((s) => (
          <section key={s.h2} className="doc-section">
            <h2>{s.h2}</h2>
            {s.blocks.map((b, i) => (
              <BlockView key={i} b={b} />
            ))}
          </section>
        ))}
        {page.faq && <Questions items={page.faq} />}
      </article>
      {DOCS_FOR[page.slug] && <InTheDocs href={DOCS_FOR[page.slug][0]} title={DOCS_FOR[page.slug][1]} text={DOCS_FOR[page.slug][2]} />}
      <Related slugs={page.related} />
    </Frame>
  );
}

/** Every guide, grouped. */
export function GuidesHub() {
  const groups: [string, Page["kind"]][] = [
    ["Comparisons", "compare"],
    ["How-tos", "howto"],
    ["Guides", "guide"],
  ];
  return (
    <Frame crumbs={[["TodoCity", "/"], ["Guides", null]]}>
      <header className="doc-head doc-hub-head">
        <p className="eyebrow">Guides</p>
        <h1>TodoCity guides</h1>
        <p className="doc-answer">
          How TodoCity works, how it compares with Things 3, Todoist and Apple Reminders, and how to move your tasks over.
        </p>
      </header>
      <InTheDocs href="/docs" title="TodoCity Docs" text="How to use every feature, one page each: capture, planning, connectors, AI agents, privacy and more." />
      {groups.map(([label, kind]) => (
        <section key={kind} className="doc-hub-group" aria-label={label}>
          <h2>{label}</h2>
          <div className="doc-cards">
            {PAGES.filter((p) => p.kind === kind).map((p) => (
              <a key={p.slug} href={`/${p.slug}`} className="doc-card">
                <span className="doc-card-title">{p.h1}</span>
                <span className="doc-card-text">{p.card}</span>
                <span className="doc-card-go">
                  Read <Arrow />
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </Frame>
  );
}

/** Every question, on one page. */
export function FaqPage() {
  return (
    <Frame crumbs={[["TodoCity", "/"], ["Questions", null]]}>
      <header className="doc-head">
        <p className="eyebrow">FAQ</p>
        <h1>TodoCity questions, answered</h1>
        <p className="doc-answer">
          TodoCity is a free to-do app for Mac. It turns any text into a dated task with AI that runs on your Mac, and every task you finish
          lights a window in your own 3D city. Here's everything people ask about it.
        </p>
      </header>
      <article className="doc-article">
        <Questions items={[...FAQ, ...MORE_FAQ]} title="All questions" />
      </article>
      <InTheDocs href="/docs" title="TodoCity Docs" text="Step-by-step help for every feature, with fixes for common questions in Troubleshooting." />
      <Related slugs={["private-todo-app-for-mac", "things-3-alternative", "todoist-alternative"]} />
    </Frame>
  );
}
