import type { ReactNode } from "react";
import { Arrow } from "./Icons";
import { Reveal } from "./Reveal";

/**
 * The home page after the demo: three things TodoCity does, each with one
 * line and a picture of the app (drawn in the app's dark theme), then what it
 * works with, privacy in one line, and the way to the city.
 */

function Row({ id, title, text, flip, children }: { id: string; title: string; text: string; flip?: boolean; children: ReactNode }) {
  return (
    <section className={flip ? "frow flip" : "frow"} id={id} aria-labelledby={`${id}-title`}>
      <Reveal className="frow-text">
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{text}</p>
      </Reveal>
      <Reveal className="frow-shot" delay={120}>
        <div className="shot" aria-hidden>
          {children}
        </div>
      </Reveal>
    </section>
  );
}

function CaptureShot() {
  return (
    <div className="sa sa-capture">
      <b className="sa-title">Add to TodoCity</b>
      <div className="sa-card">
        <span className="sa-kicker">From Slack · New task</span>
        <span className="sa-name">Send Maya the rollout checklist</span>
        <span className="sa-read">Read “by Friday 3pm” as Friday · 3:00 PM.</span>
        <span className="sa-chips">
          <i className="sel">Friday</i>
          <i>Today</i>
          <i>Tomorrow</i>
        </span>
        <span className="sa-chips">
          <i>9 AM</i>
          <i>12 PM</i>
          <i className="on">3 PM</i>
          <i>6 PM</i>
        </span>
        <span className="sa-add">Add task ↵</span>
      </div>
    </div>
  );
}

function Line({ title, right, tone, hot }: { title: string; right: string; tone?: "amber" | "red" | "violet" | "green"; hot?: boolean }) {
  return (
    <span className={hot ? "sa-line hot" : "sa-line"}>
      <i className="sa-ck" />
      <span>{title}</span>
      <em className={tone}>{right}</em>
    </span>
  );
}

function PlanShot() {
  return (
    <div className="sa sa-plan">
      <div className="sa-list">
        <b className="sa-title">Today</b>
        <span className="sa-cap red">
          Overdue 1<em>Move all to today</em>
        </span>
        <Line title="Renew passport" right="Thu" tone="red" />
        <span className="sa-cap">Today 3</span>
        <Line title="Send Maya the checklist" right="3:00 PM" tone="amber" />
        <Line title="Review the pricing page" right="Drag to 11 AM" tone="violet" hot />
        <Line title="Water the plants" right="↻ weekly" />
      </div>
      <div className="sa-hours">
        <span className="sa-cap">Friday</span>
        {(
          [
            ["9 AM", "Standup", "event"],
            ["10 AM", "Onboarding copy", "task"],
            ["11 AM", "Review the pricing page", "drop"],
            ["12 PM", "", ""],
            ["1 PM", "Design review", "event"],
          ] as const
        ).map(([h, t, k]) => (
          <span key={h} className="sa-hour">
            <small>{h}</small>
            {t && <b className={k}>{t}</b>}
          </span>
        ))}
      </div>
    </div>
  );
}

function AgentsShot() {
  return (
    <div className="sa sa-agents">
      <span className="sa-head">
        <b className="sa-title">With agents</b>
        <small>2 working · 1 to review</small>
      </span>
      <span className="sa-cap green">Ready to review</span>
      <span className="sa-line top">
        <i className="sa-ck" />
        <span>
          Draft the Q4 launch post
          <span className="sa-note">Claude Code: wrote launch-post.md with three headline options.</span>
        </span>
      </span>
      <span className="sa-cap">Working</span>
      <Line title="Fix the signup form typo" right="Codex · 2 min" tone="violet" />
      <Line title="Summarize this week's feedback" right="Cursor · 5 min" tone="violet" />
    </div>
  );
}

export function Features() {
  return (
    <div className="frows" id="features">
      <Row id="capture" title="Any text becomes a task." text="Copy as usual, then press ⌘C once more. “By Friday 3pm” becomes a deadline, and the task links back to the message.">
        <CaptureShot />
      </Row>
      <Row id="plan" flip title="Your tasks next to your calendar." text="Today sits beside your meetings from Apple Calendar. Drag a task onto an hour to make time for it.">
        <PlanShot />
      </Row>
      <Row id="agents" title="Send a task to your AI agent." text="Hand work to Claude Code, Codex or Cursor in one click. Review what it did, then tick it off. Anything it changes can be undone.">
        <AgentsShot />
      </Row>
    </div>
  );
}

const WORKS: [string, string][] = [
  ["Your other Macs", "Encrypted sync, no account"],
  ["iPhone", "Through Apple Reminders"],
  ["Apple Calendar", "Meetings in, tasks out"],
  ["Todoist", "Two-way sync"],
  ["Things 3", "Move in, stay in step"],
];

export function WorksWith() {
  return (
    <section className="works" id="works" aria-labelledby="works-title">
      <h2 id="works-title">Works with what you use.</h2>
      <Reveal className="works-list">
        {WORKS.map(([t, d]) => (
          <div key={t} className="works-item">
            <b>{t}</b>
            <span>{d}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

export function PrivacyRow() {
  return (
    <section className="slim" id="privacy" aria-label="Privacy">
      <div className="slim-row">
        <span className="slim-icon lock" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </span>
        <div>
          <b>Private by default.</b>
          <p>The AI runs on your Mac. Sync and agents stay off until you turn them on.</p>
        </div>
        <a className="slim-go" href="/private-todo-app-for-mac">
          How privacy works <Arrow />
        </a>
      </div>
      <a className="slim-row city" href="/city">
        <span className="slim-icon" aria-hidden>
          <span className="slim-sky">
            <i />
            <i />
            <i />
          </span>
        </span>
        <div>
          <b>Every task you finish lights a window.</b>
          <p>Your projects grow into a small city at night.</p>
        </div>
        <span className="slim-go gold">
          See your city <Arrow />
        </span>
      </a>
    </section>
  );
}
