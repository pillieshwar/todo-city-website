import { useEffect, useState } from "react";
import { FAQ, SITE } from "../site";
import { AppleIcon, Arrow, Check, GitHubIcon, Logo } from "./Icons";
import { Reveal } from "./Reveal";

/** "by Friday 3pm" becoming a real date, over and over. */
function DateDemo() {
  const PHRASES = [
    ["can you send the deck by Friday 3pm?", "Friday · 3:00 PM", "Deadline"],
    ["dentist next tuesday at 9", "Next Tuesday · 9:00 AM", "Planned"],
    ["water the plants every Sunday", "Every Sunday", "Repeats"],
  ] as const;
  const [i, setI] = useState(0);
  useEffect(() => {
    // Changing text is a distraction for some: it holds still if motion is reduced.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % PHRASES.length), 2800);
    return () => window.clearInterval(t);
  }, [PHRASES.length]);
  const [text, chip, kind] = PHRASES[i];
  return (
    <div className="demo-date" key={i} aria-hidden>
      <p className="demo-quote">“{text}”</p>
      <div className="demo-chip">
        <span className="demo-chip-kind">{kind}</span>
        {chip}
      </div>
    </div>
  );
}

function KeysDemo() {
  return (
    <div className="demo-keys" aria-hidden>
      <kbd>⌘</kbd>
      <kbd className="tap">C</kbd>
      <kbd className="tap two">C</kbd>
      <span className="demo-card">
        <b>Send Dana the rollout checklist</b>
        <i>Friday · from Slack</i>
      </span>
    </div>
  );
}

function HoursDemo() {
  return (
    <div className="demo-hours" aria-hidden>
      {["9 AM", "10 AM", "11 AM", "12 PM"].map((h, i) => (
        <div key={h} className="demo-hour">
          <span>{h}</span>
          {i === 1 && <b className="demo-block drop">Draft the agenda</b>}
          {i === 2 && <b className="demo-block event">Design review</b>}
        </div>
      ))}
    </div>
  );
}

function OverdueDemo() {
  return (
    <div className="demo-overdue" aria-hidden>
      <div className="demo-row late">
        <i /> Renew passport <em>Thu</em>
      </div>
      <div className="demo-row late">
        <i /> Send Q3 numbers <em>9:00 AM</em>
      </div>
      <div className="demo-move">Move all to today</div>
    </div>
  );
}

function AccentDemo() {
  return (
    <div className="demo-accent" aria-hidden>
      {["#a29bff", "#7aa7ff", "#5fd39b", "#ffa66b", "#ff8fc2"].map((c) => (
        <i key={c} style={{ background: c }} />
      ))}
      <span>12h · 24h · Mon-first · compact</span>
    </div>
  );
}

function PrivacyDemo() {
  return (
    <div className="demo-privacy" aria-hidden>
      <div className="demo-mac">
        <span className="demo-chipset">On-device AI</span>
        <span className="demo-flow" />
      </div>
      <span className="demo-cloud">Cloud</span>
    </div>
  );
}

const FEATURES = [
  { title: "Copy twice to capture", text: "Copy any text and press ⌘C once more. The task, its date and time are filled in before you've looked up.", demo: <KeysDemo /> },
  { title: "Dates, done right", text: "“by Friday 3pm” becomes a deadline, “every Sunday” a repeat. When a phrase is vague, TodoCity asks instead of guessing.", demo: <DateDemo /> },
  { title: "Today, with its hours", text: "Your list beside the day's hours and a month calendar. Drag a task onto an hour to time it, or onto a date to move it.", demo: <HoursDemo /> },
  { title: "Overdue, in one place", text: "Anything whose day, time or deadline has passed gathers in one list, not a banner on every screen.", demo: <OverdueDemo /> },
  { title: "Capture that stays on your Mac", text: "A small language model on your own computer turns what you capture into tasks. No account, no tracking, and it works offline. Sharing with AI agents is up to you.", demo: <PrivacyDemo /> },
  { title: "Make it yours", text: "Pick an accent color, a 12- or 24-hour clock, the first day of your week, compact rows, and your city's sky.", demo: <AccentDemo /> },
];

export function Features() {
  return (
    <section className="features" id="features" aria-label="Features">
      <div className="section-head">
        <p className="eyebrow">Everything else</p>
        <h2>
          Quick to capture. <em>Calm</em> to plan.
        </h2>
      </div>
      <div className="feature-grid">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} className="feature" delay={(i % 3) * 90}>
            <div className="feature-demo">{f.demo}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </Reveal>
        ))}
      </div>
      <Reveal className="ways">
        {[
          ["Side panel", "Docks at the edge of your screen, even over full-screen apps."],
          ["Menu bar", "Today's agenda under the TodoCity icon, one click away."],
          ["Full screen", "A sidebar of projects and their sections, the month, the week, and your city."],
        ].map(([t, d]) => (
          <div key={t} className="way">
            <b>{t}</b>
            <span>{d}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

export function Privacy() {
  return (
    <section className="privacy" id="privacy" aria-label="Privacy">
      <Reveal className="privacy-card">
        <p className="eyebrow">Privacy</p>
        <h2>
          Private by default. <em>Yours</em> to share.
        </h2>
        <div className="privacy-points">
          {[
            ["On-device capture", "The model that turns what you capture into tasks runs on your Mac, offline."],
            ["Your choice", "Agents and Watch can send data to Claude, Codex and others, only after you turn them on."],
            ["No account", "There's nothing to sign up for. Your tasks live in one file on your Mac, with daily backups."],
            ["Source available", "Every line is public on GitHub. Read it, build it yourself, or check what it does."],
          ].map(([t, d]) => (
            <div key={t} className="privacy-point">
              <span className="privacy-check">
                <Check />
              </span>
              <div>
                <b>{t}</b>
                <p>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

export function Faq() {
  return (
    <section className="faq" id="faq" aria-labelledby="faq-title">
      <div className="section-head">
        <p className="eyebrow">Questions</p>
        <h2 id="faq-title">
          Good to <em>know.</em>
        </h2>
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

export function Download() {
  return (
    <section className="download" id="download" aria-label="Download">
      <div className="download-glow" aria-hidden />
      <Reveal className="download-inner">
        <Logo size={64} />
        <h2>
          Turn on <em>the lights.</em>
        </h2>
        <p className="lede">Free for Mac. Your first task is one copy away.</p>
        <div className="hero-ctas center">
          <a className="btn btn-primary btn-lg" href={SITE.download}>
            <AppleIcon /> Download for Mac
          </a>
          <a className="btn btn-ghost btn-lg" href={SITE.repo} target="_blank" rel="noreferrer">
            <GitHubIcon /> View on GitHub
          </a>
        </div>
        <p className="hero-fine">{SITE.requirements} · one model download from inside the app</p>
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
            <a href={at("#story")}>The story</a>
            <a href={at("#city")}>Your city</a>
            <a href={at("#features")}>Features</a>
            <a href="/faq">Questions</a>
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
            <a href={SITE.releases} target="_blank" rel="noreferrer">
              Release notes
            </a>
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
            <a href={at("#privacy")}>Privacy</a>
            <a href={SITE.license} target="_blank" rel="noreferrer">
              Non-commercial license
            </a>
            <span>No account · no tracking</span>
            <span>{SITE.requirements}</span>
          </div>
        </nav>
      </div>
      <div className="footer-base">
        <span>© {year} TodoCity. Source available.</span>
        <span>Made for Mac, with the lights on.</span>
      </div>
    </footer>
  );
}
