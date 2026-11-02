import type { ReactNode } from "react";
import { FAQ, SITE } from "../site";
import { AppleIcon, Arrow, Logo } from "./Icons";
import { Reveal } from "./Reveal";

export function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="section-head">
        <h2 id="faq-title">Questions</h2>
      </div>
      <div className="faq-list">
        {FAQ.map((f) => (
          <details key={f.q} className="faq-item">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <p className="faq-more">
        <a href="/faq">
          More questions <Arrow />
        </a>
      </p>
    </section>
  );
}

/** The last word on a page: download, and what happens next. */
export function Download({ title = "Try it on your Mac.", children }: { title?: string; children?: ReactNode }) {
  return (
    <section className="download" id="download" aria-label="Download">
      <div className="download-glow" aria-hidden />
      <Reveal className="download-inner">
        <Logo size={64} />
        <h2>{title}</h2>
        <div className="hero-ctas center">
          <a className="btn btn-primary btn-lg" href={SITE.download}>
            <AppleIcon /> Download for Mac
          </a>
          {children}
        </div>
        <p className="hero-fine">Free · {SITE.requirements} · One AI model download (about 2 GB) on first launch</p>
        <ol className="install">
          <li>
            <b>1</b> Open the downloaded file and drag TodoCity to Applications.
          </li>
          <li>
            <b>2</b> Open TodoCity. It lives in your menu bar.
          </li>
          <li>
            <b>3</b> Copy any text and press <kbd>⌘C</kbd> again.
          </li>
        </ol>
      </Reveal>
    </section>
  );
}

export function Footer({ home = true }: { home?: boolean }) {
  const year = new Date().getFullYear();
  const at = (hash: string) => (home ? hash : `/${hash}`);
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <a href={home ? "#top" : "/"} className="brand">
            <Logo />
            <span>TodoCity</span>
          </a>
          <p>{SITE.tagline}</p>
          <a className="btn btn-primary btn-sm" href={SITE.download}>
            <AppleIcon /> Download for Mac <Arrow />
          </a>
        </div>
        <nav className="footer-cols" aria-label="Footer">
          <div>
            <h2 className="footer-h">Product</h2>
            <a href={at("#features")}>Features</a>
            <a href="/city">Your city</a>
            <a href="/faq">Questions</a>
            <a href="/docs">Docs</a>
            <a href={at("#download")}>Download</a>
          </div>
          <div>
            <h2 className="footer-h">Guides</h2>
            <a href="/things-3-alternative">TodoCity vs Things 3</a>
            <a href="/todoist-alternative">TodoCity vs Todoist</a>
            <a href="/ai-agents-mcp-todo-app">AI agents and MCP</a>
            <a href="/private-todo-app-for-mac">A private to-do app</a>
            <a href="/turn-text-into-tasks">Text into tasks</a>
            <a href="/guides">All guides</a>
          </div>
          <div>
            <h2 className="footer-h">Resources</h2>
            <a href="/docs/release-notes">Release notes</a>
            <a href={SITE.repo} target="_blank" rel="noreferrer">
              Source code
            </a>
            <a href={SITE.issues} target="_blank" rel="noreferrer">
              Report an issue
            </a>
            <a href={SITE.security} target="_blank" rel="noreferrer">
              Security
            </a>
          </div>
          <div>
            <h2 className="footer-h">Trust</h2>
            <a href="/private-todo-app-for-mac">Privacy</a>
            <a href={SITE.license} target="_blank" rel="noreferrer">
              MIT License
            </a>
            <span>No account · no tracking</span>
            <span>{SITE.requirements}</span>
          </div>
        </nav>
      </div>
      <div className="footer-base">
        <span>© {year} TodoCity. Open source (MIT).</span>
        <span>Made for Mac, with the lights on.</span>
      </div>
    </footer>
  );
}
