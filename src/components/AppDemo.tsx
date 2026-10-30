import { type CSSProperties, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import {
  GENERAL,
  NOW_MIN,
  PROJECTS,
  dateOf,
  dayLabel,
  eventsOn,
  hourLabel,
  newId,
  population,
  rangeLabel,
  readTask,
  shortDate,
  startTasks,
  timeLabel,
  weekday,
  type DemoTask,
  type Read,
} from "../demo/data";
import { DemoCity } from "./DemoCity";
import { Logo } from "./Icons";

/**
 * The app itself, in the page: the full-screen window as it looks once
 * TodoCity is installed. Everything in it works — capture a Slack message,
 * add tasks by typing, tick them off, open a project or the week, and see
 * each finished task light a window in the city.
 */

type View = "today" | "calendar" | "inbox" | "overdue" | "completed" | "city" | `p:${string}`;

/** Inbox columns, as in the app: tasks in no project by when. */
type Col = "today" | "tomorrow" | "week" | "later" | "someday";
const COLS: [Col, string][] = [
  ["today", "Today"],
  ["tomorrow", "Tomorrow"],
  ["week", "Next 7 days"],
  ["later", "Later"],
  ["someday", "Someday"],
];
/** The day a task dropped on a column gets (null: no date). */
const COL_DAY: Record<Col, number | null> = { today: 0, tomorrow: 1, week: 2, later: 8, someday: null };
function colOf(t: DemoTask): Col {
  const d = t.day === "someday" ? undefined : t.day ?? t.deadline;
  if (d === undefined) return "someday";
  if (d <= 0) return "today";
  if (d === 1) return "tomorrow";
  return d <= 7 ? "week" : "later";
}

/** The guided path: copy → add → tick → city → free to explore. */
type Step = 0 | 1 | 2 | 3 | 4;

const STEPS = ["Copy a message twice", "Add the task", "Tick it off", "Find its light"];

const SLACK_TEXT = "can you send me the rollout checklist by Friday 3pm?";
const CAPTURED = "Send Maya the rollout checklist";
const DAY_CHIPS: [string, number | null][] = [
  ["Friday", 1],
  ["Today", 0],
  ["Next week", 4],
  ["No date", null],
];
const TIME_CHIPS: [string, number | null][] = [
  ["Any time", null],
  ["9 AM", 9 * 60],
  ["12 PM", 12 * 60],
  ["3 PM", 15 * 60],
  ["6 PM", 18 * 60],
];

const projectOf = (id?: string) => PROJECTS.find((p) => p.id === id);
const isLate = (t: DemoTask) => !t.done && ((typeof t.day === "number" && t.day < 0) || (t.deadline !== undefined && t.deadline < 0));
const inToday = (t: DemoTask) => !t.done && !isLate(t) && ((t.day === 0 && !t.evening) || t.deadline === 0);
const inEvening = (t: DemoTask) => !t.done && t.day === 0 && !!t.evening;
const byTime = (a: DemoTask, b: DemoTask) => (a.time ?? 9999) - (b.time ?? 9999);

export function AppDemo() {
  const [tasks, setTasks] = useState<DemoTask[]>(startTasks);
  const [view, setView] = useState<View>("today");
  const [open, setOpen] = useState<number | null>(null);
  const [step, setStep] = useState<Step>(0);
  const [capture, setCapture] = useState<null | "reading" | "ready">(null);
  const [cTitle, setCTitle] = useState(CAPTURED);
  const [cDay, setCDay] = useState<number | null>(1);
  const [cTime, setCTime] = useState<number | null>(15 * 60);
  const [cWhere, setCWhere] = useState("launch:Rollout");
  const [adding, setAdding] = useState(false);
  const [typed, setTyped] = useState("");
  const [toast, setToast] = useState<{ text: string; key: number; city?: boolean } | null>(null);
  const [glow, setGlow] = useState(0);
  const [week, setWeek] = useState(0);
  const [board, setBoard] = useState(true);
  const [cityFocus, setCityFocus] = useState<string | undefined>();
  const fresh = useRef<number | null>(null);
  const slack = useRef<HTMLParagraphElement>(null);
  const addBtn = useRef<HTMLButtonElement>(null);
  const lastCopy = useRef(0);
  const startDone = useRef(population(startTasks()));

  const pop = population(tasks);
  const movedInToday = Math.max(0, pop - startDone.current + 1);

  function say(text: string, city = false) {
    setToast({ text, key: Date.now(), city });
  }
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), toast.city ? 5200 : 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  // ── Capture: select Maya's message and press ⌘C twice ─────────────────────
  function startCapture() {
    if (capture) return;
    setCTitle(CAPTURED);
    setCDay(1);
    setCTime(15 * 60);
    setCWhere("launch:Rollout");
    setCapture("reading");
    if (step === 0) setStep(1);
    window.setTimeout(() => setCapture("ready"), 900);
  }
  const startRef = useRef(startCapture);
  startRef.current = startCapture;
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey) || e.key.toLowerCase() !== "c") return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !slack.current?.contains(sel.anchorNode)) return;
      const now = Date.now();
      if (now - lastCopy.current < 900) {
        lastCopy.current = 0;
        startRef.current();
      } else lastCopy.current = now;
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (capture === "ready") addBtn.current?.focus({ preventScroll: true });
  }, [capture]);
  const quick = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (adding) quick.current?.focus({ preventScroll: true });
  }, [adding]);

  function addCaptured(e: FormEvent) {
    e.preventDefault();
    const [project, section] = cWhere ? cWhere.split(":") : [];
    const id = newId();
    fresh.current = id;
    setTasks((ts) => [
      ...ts,
      {
        id,
        title: cTitle.trim() || CAPTURED,
        project: project || undefined,
        section: section && section !== GENERAL ? section : undefined,
        deadline: cDay ?? undefined,
        deadlineTime: cDay !== null && cTime !== null ? cTime : undefined,
        source: "Slack",
        notes: `From Maya in #launch: “${SLACK_TEXT}”`,
        fresh: true,
        done: false,
      },
    ]);
    setCapture(null);
    setOpen(null);
    setView(project ? `p:${project}:${section || GENERAL}` : cDay === 0 ? "today" : "inbox");
    if (step <= 1) setStep(2);
    const p = projectOf(project);
    say(p ? `Added to ${p.name} · # ${section || GENERAL}` : "Added");
  }

  // ── Ticking off: someone moves in ─────────────────────────────────────────
  function toggle(id: number) {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    setTasks((ts) => ts.map((x) => (x.id === id ? { ...x, done: !x.done, fresh: false } : x)));
    if (t.done) return;
    setGlow((g) => g + 1);
    const p = projectOf(t.project);
    say(`Lights on in ${p ? p.name : "a house at the edge of town"} · someone moved in`, true);
    if (id === fresh.current && step <= 2) setStep(3);
  }
  function toggleSub(id: number, i: number) {
    setTasks((ts) => ts.map((x) => (x.id === id && x.sub ? { ...x, sub: x.sub.map((s, k) => (k === i ? { ...s, done: !s.done } : s)) } : x)));
  }
  function moveToToday(ids: number[]) {
    setTasks((ts) => ts.map((x) => (ids.includes(x.id) ? { ...x, day: 0, deadline: x.deadline !== undefined && x.deadline < 0 ? 0 : x.deadline } : x)));
    say(ids.length > 1 ? `Moved ${ids.length} tasks to Today` : "Moved to Today");
  }

  function moveTask(id: number, day: number, time: number | undefined, deadline: boolean) {
    setTasks((ts) =>
      ts.map((x) => (x.id !== id ? x : deadline ? { ...x, deadline: day, deadlineTime: time } : { ...x, day, time, evening: time === undefined ? x.evening : false })),
    );
    say(`Moved to ${dayLabel(day)}${time !== undefined ? ` · ${timeLabel(time)}` : ""}`);
  }

  // ── Inbox board: drop a task on a column, or add one there ────────────────
  function moveToCol(id: number, col: Col) {
    const t = tasks.find((x) => x.id === id);
    if (!t || colOf(t) === col) return;
    const day = COL_DAY[col];
    setTasks((ts) => ts.map((x) => (x.id !== id ? x : day === null ? { ...x, day: "someday", time: undefined, evening: false } : { ...x, day })));
    say(day === null ? "Moved to Someday" : `Moved to ${dayLabel(day)}`);
  }
  function addToCol(col: Col, text: string) {
    const r = readTask(text);
    if (!r.title) return;
    const day = r.day ?? COL_DAY[col] ?? (r.deadline === undefined ? "someday" : undefined);
    setTasks((ts) => [...ts, { id: newId(), title: r.title, project: r.project, day, evening: r.evening, time: r.time, deadline: r.deadline, deadlineTime: r.deadlineTime, tag: r.tag, repeat: r.repeat, fresh: true, done: false }]);
    say(`Added to ${projectOf(r.project)?.name ?? "Inbox"}`);
  }

  function openCity(focus?: string) {
    setCityFocus(focus);
    setView("city");
    setCapture(null);
    if (step === 3) setStep(4);
  }

  // ── Quick add: type a task the way you'd say it ───────────────────────────
  const reading: Read = useMemo(() => readTask(typed), [typed]);
  function addTyped(e: FormEvent) {
    e.preventDefault();
    const r = readTask(typed);
    if (!r.title) return;
    const [, here, hereSection] = view.startsWith("p:") ? view.split(":") : [];
    const project = r.project ?? here;
    const section = r.project ? undefined : hereSection && hereSection !== GENERAL ? hereSection : undefined;
    const day = r.day ?? (view === "today" && r.deadline === undefined ? 0 : undefined);
    setTasks((ts) => [...ts, { id: newId(), title: r.title, project, section, day, evening: r.evening, time: r.time, deadline: r.deadline, deadlineTime: r.deadlineTime, tag: r.tag, repeat: r.repeat, fresh: true, done: false }]);
    setTyped("");
    setAdding(false);
    const where = projectOf(project)?.name ?? (typeof day === "number" ? dayLabel(day) : "Inbox");
    say(`Added to ${where}`);
  }

  function reset() {
    setTasks(startTasks());
    setView("today");
    setStep(0);
    setCapture(null);
    setOpen(null);
    setAdding(false);
    setToast(null);
    setWeek(0);
    fresh.current = null;
    window.getSelection()?.removeAllRanges();
  }

  function go(v: View) {
    setView(v);
    setOpen(null);
    setAdding(false);
  }

  // ── What each list holds ──────────────────────────────────────────────────
  const counts = {
    today: tasks.filter((t) => inToday(t) || inEvening(t)).length,
    inbox: tasks.filter((t) => !t.done && !t.project).length,
    overdue: tasks.filter(isLate).length,
  };

  const rowProps = { open, onOpen: (id: number) => setOpen((o) => (o === id ? null : id)), onTick: toggle, onSub: toggleSub, onToday: (id: number) => moveToToday([id]) };

  let title = "";
  let subtitle = "";
  let body: ReactNode = null;
  const [, pid, psec] = view.startsWith("p:") ? view.split(":") : [];
  const proj = projectOf(pid);

  if (view === "today") {
    const late = tasks.filter(isLate);
    const today = tasks.filter(inToday).sort(byTime);
    const evening = tasks.filter(inEvening);
    const done = tasks.filter((t) => t.done && !t.earlier);
    title = "Today";
    subtitle = `${weekday(0, true)}, Oct 29 · ${today.length + evening.length} to do`;
    body = (
      <>
        {late.length > 0 && (
          <Group name="Overdue" count={late.length} tone="late" action={<button type="button" className="ad-link late" onClick={() => moveToToday(late.map((t) => t.id))}>Move all to today</button>}>
            {late.map((t) => <Row key={t.id} t={t} {...rowProps} showProject />)}
          </Group>
        )}
        <Group name="Today" count={today.length}>
          {today.map((t) => <Row key={t.id} t={t} {...rowProps} showProject />)}
          {!today.length && <Empty>Nothing else for today. Enjoy the evening.</Empty>}
        </Group>
        {evening.length > 0 && (
          <Group name="This evening" count={evening.length}>
            {evening.map((t) => <Row key={t.id} t={t} {...rowProps} showProject />)}
          </Group>
        )}
        {done.length > 0 && (
          <Group name="Done" count={done.length}>
            {done.map((t) => <Row key={t.id} t={t} {...rowProps} showProject />)}
          </Group>
        )}
      </>
    );
  } else if (view === "inbox") {
    const mine = tasks.filter((t) => !t.project);
    title = "Inbox";
    subtitle = `Tasks in no project · ${mine.filter((t) => !t.done).length} to do`;
    body = board ? (
      <Board tasks={mine.filter((t) => !t.done)} onTick={toggle} onMove={moveToCol} onAdd={addToCol} />
    ) : (
      <>
        {COLS.map(([c, name]) => {
          const list = mine.filter((t) => !t.done && colOf(t) === c);
          return list.length ? (
            <Group key={c} name={name} count={list.length}>
              {list.map((t) => <Row key={t.id} t={t} {...rowProps} />)}
            </Group>
          ) : null;
        })}
        {mine.some((t) => t.done) && (
          <Group name="Completed" count={mine.filter((t) => t.done).length}>
            {mine.filter((t) => t.done).map((t) => <Row key={t.id} t={t} {...rowProps} />)}
          </Group>
        )}
      </>
    );
  } else if (view === "overdue" || view === "completed") {
    const list = tasks.filter(view === "overdue" ? isLate : (t: DemoTask) => t.done);
    title = view === "overdue" ? "Overdue" : "Completed";
    subtitle = view === "overdue" ? "Anything whose day or deadline has passed" : "Everything you've finished";
    body = (
      <Group name={title} count={list.length} tone={view === "overdue" ? "late" : undefined}
        action={view === "overdue" && list.length > 0 ? <button type="button" className="ad-link late" onClick={() => moveToToday(list.map((t) => t.id))}>Move all to today</button> : undefined}>
        {list.map((t) => <Row key={t.id} t={t} {...rowProps} showProject />)}
        {!list.length && <Empty>{view === "overdue" ? "All caught up." : "Nothing here yet."}</Empty>}
      </Group>
    );
  } else if (proj) {
    const mine = tasks.filter((t) => t.project === proj.id);
    const sections = psec ? [psec] : proj.sections;
    title = psec && psec !== GENERAL ? `# ${psec}` : proj.name;
    subtitle = psec ? `${proj.name} · ${mine.filter((t) => (t.section ?? GENERAL) === psec && !t.done).length} to do` : `${mine.filter((t) => !t.done).length} to do · ${mine.filter((t) => t.done).length} done`;
    body = (
      <>
        {sections.map((s) => {
          const list = mine.filter((t) => (t.section ?? GENERAL) === s);
          const todo = list.filter((t) => !t.done);
          const done = list.filter((t) => t.done);
          return (
            <Group key={s} name={`# ${s}`} count={todo.length} plain>
              {todo.map((t) => <Row key={t.id} t={t} {...rowProps} />)}
              {done.map((t) => <Row key={t.id} t={t} {...rowProps} />)}
              {!list.length && <Empty>No tasks in this section yet.</Empty>}
            </Group>
          );
        })}
        <button type="button" className="ad-city-link" onClick={() => openCity(proj.id)}>
          <Windows lit={mine.filter((t) => t.done).length} total={mine.length} />
          See {proj.name} in your city
        </button>
      </>
    );
  } else if (view === "calendar") {
    title = "Calendar";
    body = <Week tasks={tasks} start={week * 7} onTick={toggle} onMove={moveTask} />;
  }

  return (
    <div className="ad">
      <div className="ad-coach">
        <ol className="ad-steps" aria-label="Try it in four steps">
          {STEPS.map((s, i) => (
            <li key={s} className={step === i ? "on" : step > i ? "done" : ""} aria-current={step === i ? "step" : undefined}>
              <span>{step > i ? "✓" : i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <div className="ad-hint" aria-live="polite">
          {step === 0 && (
            <p>
              Select Maya's message and press <kbd>⌘</kbd>
              <kbd>C</kbd> twice, or press the button under it.
            </p>
          )}
          {step === 2 && <p>It's in the <b>Launch</b> project, in the <b># Rollout</b> section. Tick its circle once it's done.</p>}
          {step === 3 && (
            <p>
              Someone just moved in.{" "}
              <button type="button" className="ad-link" onClick={() => openCity("launch")}>
                Open your city to find the light →
              </button>
            </p>
          )}
          {step === 4 && (
            <p>
              That's the whole idea. Now click around: every list, project and button in this window works.{" "}
              <button type="button" className="ad-link" onClick={reset}>
                Start over
              </button>
            </p>
          )}
        </div>
      </div>

      <div className="ad-slack" aria-label="A Slack message to try capturing">
        <div className="ad-slack-head">
          <span className="ad-avatar" aria-hidden>
            M
          </span>
          <b>Maya</b>
          <span>9:38 AM · #launch</span>
        </div>
        <p ref={slack} className="ad-slack-text">
          Morning! <mark>{SLACK_TEXT}</mark>
        </p>
        <button type="button" className={step === 0 ? "ad-copy pulse" : "ad-copy"} onClick={startCapture} disabled={!!capture}>
          <kbd>⌘C</kbd>
          <kbd>⌘C</kbd>
          {step === 0 ? "Copy it twice" : "Capture it again"}
        </button>
      </div>

      <div className="ad-mac" role="region" aria-label="TodoCity, the Mac app: try it here">
        <div className="ad-menubar" aria-hidden>
          <span className="ad-menu-left">
            <b>TodoCity</b>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Window</span>
          </span>
          <span className="ad-menu-right">
            <span className={capture ? "ad-tray on" : "ad-tray"}>
              <Logo size={14} />
            </span>
            <span>Thu Oct 29  9:41 AM</span>
          </span>
        </div>

        <div className={view === "city" ? "ad-app city" : view === "calendar" || (view === "inbox" && board) ? "ad-app wide" : "ad-app"}>
          <nav className="ad-side" aria-label="Lists">
            <div className="ad-lights" aria-hidden>
              <i />
              <i />
              <i />
              <b>TodoCity</b>
            </div>
            <div className="ad-search" aria-hidden>
              Search <kbd>⌘K</kbd>
            </div>
            <SideItem icon="★" color="#a29bff" label="Today" count={counts.today} on={view === "today"} onClick={() => go("today")} />
            <SideItem icon="▦" color="#ff8a7a" label="Calendar" on={view === "calendar"} onClick={() => go("calendar")} />
            <SideItem icon="⊟" color="#a29bff" label="Inbox" count={counts.inbox} on={view === "inbox"} onClick={() => go("inbox")} />
            <SideItem icon="◷" color="#ff6b57" label="Overdue" count={counts.overdue} late on={view === "overdue"} onClick={() => go("overdue")} />
            <SideItem icon="✓" color="#4ade80" label="Completed" on={view === "completed"} onClick={() => go("completed")} />
            <p className="ad-side-head">Projects</p>
            {PROJECTS.map((p) => {
              const here = pid === p.id;
              return (
                <div key={p.id}>
                  <SideItem ring={p.color} label={p.name} count={tasks.filter((t) => t.project === p.id && !t.done).length || undefined} on={here && !psec} onClick={() => go(`p:${p.id}`)} />
                  {here &&
                    p.sections.map((s) => (
                      <button key={s} type="button" className={psec === s ? "ad-sec on" : "ad-sec"} aria-current={psec === s ? "page" : undefined} onClick={() => go(`p:${p.id}:${s}`)}>
                        # {s}
                        <span>{tasks.filter((t) => t.project === p.id && (t.section ?? GENERAL) === s && !t.done).length || ""}</span>
                      </button>
                    ))}
                </div>
              );
            })}
            <div className="ad-side-foot">
              <p className="ad-onmac">
                <i aria-hidden /> AI on this Mac · <kbd>⌘C</kbd> twice to capture
              </p>
              <button type="button" className={view === "city" ? "ad-mayor on" : "ad-mayor"} onClick={() => openCity()}>
                <span className="ad-mayor-pic" aria-hidden>
                  S
                </span>
                <span>
                  <b>Mayor Sam</b>
                  <span>Lumen Bay · population {pop}</span>
                </span>
              </button>
            </div>
          </nav>

          {/* Phones: the sidebar becomes a row of tabs. */}
          <div className="ad-tabs" role="group" aria-label="Lists">
            {(
              [
                ["today", "Today"],
                ["calendar", "Calendar"],
                ["p:launch", "Launch"],
                ["inbox", "Inbox"],
                ["overdue", "Overdue"],
                ["city", "Your city"],
              ] as [View, string][]
            ).map(([v, l]) => (
              <button key={v} type="button" className={view === v || (v === "p:launch" && pid === "launch") ? "on" : ""} onClick={() => (v === "city" ? openCity() : go(v))}>
                {l}
              </button>
            ))}
          </div>

          {view === "city" ? (
            <div className="ad-main ad-main-city">
              <DemoCity tasks={tasks} projects={PROJECTS} focus={cityFocus} population={pop} today={movedInToday} onOpenProject={(id) => go(`p:${id}`)} />
            </div>
          ) : (
            <div className="ad-main">
              <header className="ad-head">
                <div>
                  <h2>{title}</h2>
                  {view === "calendar" ? (
                    <div className="ad-weeknav">
                      <button type="button" aria-label="Previous week" onClick={() => setWeek((w) => w - 1)}>
                        <Chevron left />
                      </button>
                      <button type="button" aria-label="Next week" onClick={() => setWeek((w) => w + 1)}>
                        <Chevron />
                      </button>
                      <b aria-live="polite">{rangeLabel(week * 7, week * 7 + 6)}</b>
                      {week !== 0 && (
                        <button type="button" className="ad-weeknav-today" onClick={() => setWeek(0)}>
                          This week
                        </button>
                      )}
                    </div>
                  ) : (
                    <span>{subtitle}</span>
                  )}
                </div>
                <div className="ad-head-tools">
                  {view === "inbox" && (
                    <div className="ad-viewswitch" role="group" aria-label="Show as">
                      <button type="button" aria-label="List" aria-pressed={!board} onClick={() => setBoard(false)}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
                          <path d="M5.5 4h8M5.5 8h8M5.5 12h8M2.5 4h.01M2.5 8h.01M2.5 12h.01" />
                        </svg>
                      </button>
                      <button type="button" aria-label="Board" aria-pressed={board} onClick={() => setBoard(true)}>
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden>
                          <path d="M2.5 2.5h3v11h-3zM6.5 2.5h3v7h-3zM10.5 2.5h3v9h-3z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <button type="button" className="ad-add" onClick={() => setAdding((a) => !a)} aria-expanded={adding}>
                    + Add Task
                  </button>
                </div>
              </header>
              <div className="ad-scroll">
                {adding && (
                  <form className="ad-quick" onSubmit={addTyped}>
                    <label htmlFor="ad-quick-in" className="sr-only">
                      New task
                    </label>
                    <input
                      id="ad-quick-in"
                      value={typed}
                      autoComplete="off"
                      maxLength={90}
                      placeholder="Try: pay rent friday 5pm every month #home"
                      onChange={(e) => setTyped(e.target.value)}
                      onKeyDown={(e) => e.key === "Escape" && setAdding(false)}
                      ref={quick}
                    />
                    <div className="ad-read" aria-live="polite">
                      {typed.trim() ? <ReadChips r={reading} /> : <span className="ad-faint">Type a task the way you'd say it. TodoCity reads the day, time, repeat and project.</span>}
                      <button type="submit" className="ad-add sm" disabled={!reading.title}>
                        Add ↵
                      </button>
                    </div>
                  </form>
                )}
                {body}
              </div>
              {view !== "calendar" && !(view === "inbox" && board) && <MiniCity tasks={tasks} pop={pop} glow={glow} onOpen={() => openCity(pid)} />}
            </div>
          )}

          {view !== "city" && view !== "calendar" && !(view === "inbox" && board) && <TodayPane
              tasks={tasks}
              onDay={(o) => {
                setWeek(Math.floor(o / 7));
                go("calendar");
              }}
            />}

          {capture && (
            <form className="ad-capture" onSubmit={addCaptured} onKeyDown={(e) => e.key === "Escape" && setCapture(null)} aria-label="New task from Slack">
              <p className="ad-cap-from">From Slack · new task</p>
              {capture === "reading" ? (
                <div className="ad-cap-reading" role="status">
                  <span className="ad-spin" aria-hidden />
                  Reading it on your Mac…
                </div>
              ) : (
                <>
                  <label htmlFor="ad-cap-title" className="sr-only">
                    Task
                  </label>
                  <input id="ad-cap-title" className="ad-cap-title" value={cTitle} maxLength={80} onChange={(e) => setCTitle(e.target.value)} />
                  <p className="ad-cap-said">
                    Read “by Friday 3pm” as a deadline: <b>Friday · 3:00 PM</b>
                  </p>
                  <div className="ad-chips" role="group" aria-label="Deadline day">
                    {DAY_CHIPS.map(([l, d]) => (
                      <button key={l} type="button" className={cDay === d ? "on" : ""} aria-pressed={cDay === d} onClick={() => setCDay(d)}>
                        {l}
                      </button>
                    ))}
                  </div>
                  {cDay !== null && (
                    <div className="ad-chips sm" role="group" aria-label="Deadline time">
                      {TIME_CHIPS.map(([l, m]) => (
                        <button key={l} type="button" className={cTime === m ? "on violet" : ""} aria-pressed={cTime === m} onClick={() => setCTime(m)}>
                          {l}
                        </button>
                      ))}
                    </div>
                  )}
                  <label className="ad-cap-where">
                    <span>Project</span>
                    <select value={cWhere} onChange={(e) => setCWhere(e.target.value)}>
                      {PROJECTS.flatMap((p) =>
                        p.sections.map((s) => (
                          <option key={`${p.id}:${s}`} value={`${p.id}:${s}`}>
                            {p.name} · # {s}
                          </option>
                        )),
                      )}
                      <option value="">No project</option>
                    </select>
                  </label>
                  <div className="ad-cap-actions">
                    <button type="button" className="ad-btn" onClick={() => setCapture(null)}>
                      Discard <kbd>Esc</kbd>
                    </button>
                    <button type="submit" ref={addBtn} className="ad-btn primary">
                      Add task <kbd>↵</kbd>
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {toast && (
            <div key={toast.key} className={toast.city ? "ad-toast gold" : "ad-toast"} role="status">
              {toast.city && <span className="ad-toast-light" aria-hidden />}
              {toast.text}
              {toast.city && view !== "city" && (
                <button type="button" className="ad-link" onClick={() => openCity(pid ?? "launch")}>
                  See it
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Pieces ────────────────────────────────────────────────────────────────────

function SideItem({ icon, color, ring, label, count, late, on, onClick }: { icon?: string; color?: string; ring?: string; label: string; count?: number; late?: boolean; on: boolean; onClick: () => void }) {
  return (
    <button type="button" className={on ? "ad-item on" : "ad-item"} aria-current={on ? "page" : undefined} onClick={onClick}>
      {ring ? <i className="ad-ring" style={{ borderColor: ring }} aria-hidden /> : <i className="ad-ico" style={{ color }} aria-hidden>{icon}</i>}
      <span>{label}</span>
      {!!count && <em className={late ? "late" : ""}>{count}</em>}
    </button>
  );
}

function Group({ name, count, tone, action, plain, children }: { name: string; count: number; tone?: "late"; action?: ReactNode; plain?: boolean; children: ReactNode }) {
  return (
    <section className="ad-group">
      <h3 className={[tone ?? "", plain ? "plain" : ""].join(" ")}>
        {name} <span>{count || ""}</span>
        {action}
      </h3>
      {children}
    </section>
  );
}

const Empty = ({ children }: { children: ReactNode }) => <p className="ad-empty">{children}</p>;

function metaOf(t: DemoTask, showProject: boolean) {
  const out: { text: string; tone?: "late" | "amber" | "violet" | "faint"; dot?: string }[] = [];
  if (typeof t.day === "number" && t.day < 0 && !t.done) out.push({ text: shortDate(t.day), tone: "late" });
  else if (typeof t.day === "number" && t.day > 0) out.push({ text: dayLabel(t.day) + (t.time !== undefined ? ` · ${timeLabel(t.time)}` : "") });
  else if (t.time !== undefined) out.push({ text: timeLabel(t.time) });
  if (t.deadline !== undefined && !t.done) {
    const when = t.deadline === 0 ? "Due today" : `Deadline ${t.deadline > 0 && t.deadline < 7 ? weekday(t.deadline) : shortDate(t.deadline)}`;
    out.push({ text: when + (t.deadlineTime !== undefined ? ` · ${timeLabel(t.deadlineTime)}` : ""), tone: t.deadline < 0 ? "late" : "amber" });
  }
  if (t.repeat) out.push({ text: "Repeats", tone: "faint" });
  if (t.source) out.push({ text: `from ${t.source}`, tone: "violet" });
  if (t.tag) out.push({ text: `#${t.tag}`, tone: "faint" });
  const p = projectOf(t.project);
  if (showProject && p) out.push({ text: t.section ? `${p.name} · ${t.section}` : p.name, dot: p.color });
  return out;
}

function Row({
  t,
  showProject = false,
  open,
  onOpen,
  onTick,
  onSub,
  onToday,
}: {
  t: DemoTask;
  showProject?: boolean;
  open: number | null;
  onOpen: (id: number) => void;
  onTick: (id: number) => void;
  onSub: (id: number, i: number) => void;
  onToday: (id: number) => void;
}) {
  const p = projectOf(t.project);
  const isOpen = open === t.id;
  const subsDone = t.sub?.filter((s) => s.done).length ?? 0;
  return (
    <div className={["ad-row", t.done ? "done" : "", t.fresh && !t.done ? "fresh" : "", isLate(t) ? "late" : "", isOpen ? "open" : ""].join(" ")}>
      <button
        type="button"
        className="ad-check"
        style={{ "--c": p?.color ?? "#80868c" } as CSSProperties}
        aria-pressed={t.done}
        aria-label={`${t.done ? "Not done" : "Done"}: ${t.title}`}
        onClick={() => onTick(t.id)}
      >
        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
        </svg>
      </button>
      <div className="ad-row-body">
        <button type="button" className="ad-row-title" aria-expanded={isOpen} onClick={() => onOpen(t.id)}>
          {t.title}
          {t.sub && !t.done && <span className="ad-subcount">{subsDone}/{t.sub.length}</span>}
        </button>
        {isOpen && (
          <div className="ad-detail">
            {t.notes && <p className="ad-notes">{t.notes}</p>}
            {t.sub && (
              <ul className="ad-subs">
                {t.sub.map((s, i) => (
                  <li key={s.title}>
                    <label>
                      <input type="checkbox" checked={s.done} onChange={() => onSub(t.id, i)} /> <span className={s.done ? "done" : ""}>{s.title}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <dl>
              <dt>When</dt>
              <dd>{t.day === "someday" ? "Someday" : typeof t.day === "number" ? `${dayLabel(t.day)}${t.evening ? " · Evening" : ""}${t.time !== undefined ? ` · ${timeLabel(t.time)}` : ""}` : "No date"}</dd>
              {t.deadline !== undefined && (
                <>
                  <dt>Deadline</dt>
                  <dd>
                    {shortDate(t.deadline)}
                    {t.deadlineTime !== undefined && ` · ${timeLabel(t.deadlineTime)}`}
                  </dd>
                </>
              )}
              <dt>Project</dt>
              <dd>{p ? `${p.name} · # ${t.section ?? GENERAL}` : "None"}</dd>
              {t.repeat && (
                <>
                  <dt>Repeat</dt>
                  <dd>{t.repeat}</dd>
                </>
              )}
            </dl>
            {isLate(t) && (
              <button type="button" className="ad-btn sm" onClick={() => onToday(t.id)}>
                Move to today
              </button>
            )}
          </div>
        )}
      </div>
      <div className="ad-meta">
        {metaOf(t, showProject).map((m) => (
          <span key={m.text} className={m.tone ?? ""}>
            {m.dot && <i style={{ background: m.dot }} aria-hidden />}
            {m.text}
          </span>
        ))}
      </div>
    </div>
  );
}

function ReadChips({ r }: { r: Read }) {
  const p = projectOf(r.project);
  const chips: string[] = [];
  if (r.day === "someday") chips.push("Someday");
  else if (r.day !== undefined) chips.push(dayLabel(r.day) + (r.evening ? " · Evening" : ""));
  if (r.time !== undefined) chips.push(timeLabel(r.time));
  if (r.deadline !== undefined) chips.push(`Deadline ${dayLabel(r.deadline)}${r.deadlineTime !== undefined ? ` · ${timeLabel(r.deadlineTime)}` : ""}`);
  if (r.repeat) chips.push(r.repeat);
  if (p) chips.push(p.name);
  if (r.tag) chips.push(`#${r.tag}`);
  return (
    <span className="ad-readchips">
      <b>{r.title || "…"}</b>
      {chips.map((c) => (
        <span key={c}>{c}</span>
      ))}
    </span>
  );
}

const Chevron = ({ left = false }: { left?: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={left ? "M10 3.5 5.5 8l4.5 4.5" : "M6 3.5 10.5 8 6 12.5"} />
  </svg>
);

/** A small row of windows: one per task, lit when done. */
function Windows({ lit, total }: { lit: number; total: number }) {
  return (
    <span className="ad-windows" aria-hidden>
      {Array.from({ length: Math.min(total, 12) }, (_, i) => (
        <i key={i} className={i < lit ? "lit" : ""} />
      ))}
    </span>
  );
}

/** The city card in the corner, as in the app: it glows when someone moves in. */
function MiniCity({ tasks, pop, glow, onOpen }: { tasks: DemoTask[]; pop: number; glow: number; onOpen: () => void }) {
  return (
    <button type="button" className="ad-mini" onClick={onOpen}>
      <span className="sr-only">Open your city: </span>
      <span key={glow} className={glow ? "ad-mini-sky glow" : "ad-mini-sky"} aria-hidden>
        {PROJECTS.map((p) => {
          const mine = tasks.filter((t) => t.project === p.id);
          return (
            <span key={p.id} className="ad-mini-b">
              {mine.map((t) => (
                <i key={t.id} className={t.done ? "lit" : ""} />
              ))}
            </span>
          );
        })}
      </span>
      <span className="ad-mini-text">
        <b>Lumen Bay</b>
        <span>Population {pop}</span>
      </span>
    </button>
  );
}

const HOURS = Array.from({ length: 11 }, (_, i) => 8 + i);
const HOUR_PX = 34;
const top = (min: number) => ((min - 8 * 60) / 60) * HOUR_PX;

/** The pane on the right: this month, and today's hours. */
function TodayPane({ tasks, onDay }: { tasks: DemoTask[]; onDay: (offset: number) => void }) {
  // October 2026, Sunday first: Sep 27 to Nov 7.
  const cells = Array.from({ length: 42 }, (_, i) => i - 32);
  const busy = (o: number) => tasks.some((t) => !t.done && (t.day === o || t.deadline === o));
  const timed = tasks.filter((t) => t.day === 0 && t.time !== undefined);
  return (
    <aside className="ad-pane" aria-label="This month and today's hours">
      <p className="ad-month">October</p>
      <div className="ad-cal" role="group" aria-label="October">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="ad-cal-dow" aria-hidden>
            {d}
          </span>
        ))}
        {cells.map((o) => {
          const d = dateOf(o);
          return (
            <button
              key={o}
              type="button"
              className={[o === 0 ? "today" : "", d.getMonth() !== 9 ? "out" : "", busy(o) ? (o < 0 ? "dot late" : "dot") : ""].join(" ")}
              aria-label={shortDate(o)}
              onClick={() => onDay(o)}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <p className="ad-pane-head">Today's hours</p>
      <div className="ad-hours" style={{ height: HOURS.length * HOUR_PX }}>
        {HOURS.map((h) => (
          <span key={h} className="ad-hour" style={{ top: top(h * 60) }}>
            {hourLabel(h)}
          </span>
        ))}
        <span className="ad-now" style={{ top: top(NOW_MIN) }} aria-hidden />
        {eventsOn(0).map((e) => (
          <span key={e.title} className="ad-block event" style={{ top: top(e.start), height: Math.max(18, top(e.end) - top(e.start)) }}>
            {e.title}
          </span>
        ))}
        {timed.map((t) => (
          <span key={t.id} className={t.done ? "ad-block done" : "ad-block"} style={{ top: top(t.time!), height: 22, borderColor: projectOf(t.project)?.color }}>
            {t.title}
          </span>
        ))}
      </div>
    </aside>
  );
}

interface Drag {
  id: number;
  title: string;
  color?: string;
  x: number;
  y: number;
  /** Where it would land: a day, and an hour unless it's dropped on the all-day row. */
  target: { day: number; time?: number } | null;
}

/**
 * Calendar: a week, every hour, tasks beside meetings. Drag a task to
 * another day or hour (mouse or finger); click it to tick it off.
 */
function Week({
  tasks,
  start,
  onTick,
  onMove,
}: {
  tasks: DemoTask[];
  start: number;
  onTick: (id: number) => void;
  onMove: (id: number, day: number, time: number | undefined, deadline: boolean) => void;
}) {
  const days = Array.from({ length: 7 }, (_, i) => start + i);
  const at = (t: DemoTask, d: number) => (t.day === d && t.time !== undefined ? t.time : t.deadline === d && t.deadlineTime !== undefined ? t.deadlineTime : undefined);
  const cols = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<Drag | null>(null);
  const press = useRef<{ id: number; title: string; color?: string; x0: number; y0: number; moved: boolean; deadline: boolean } | null>(null);
  const dragged = useRef(false);
  const moveRef = useRef(onMove);
  moveRef.current = onMove;

  useEffect(() => {
    // The day and quarter hour under the pointer.
    const targetAt = (x: number, y: number): Drag["target"] => {
      const b = body.current?.getBoundingClientRect();
      const c = cols.current?.getBoundingClientRect();
      if (!b || !c) return null;
      const i = Math.floor((x - b.left - 52) / ((b.width - 52) / 7));
      if (i < 0 || i > 6) return null;
      if (y >= b.top && y <= b.bottom) {
        const min = 480 + Math.round((((y - b.top) / 40) * 60) / 15) * 15;
        return { day: start + i, time: Math.min(18 * 60 + 30, Math.max(480, min)) };
      }
      if (y >= c.top && y < b.top) return { day: start + i };
      return null;
    };
    const move = (e: PointerEvent) => {
      const p = press.current;
      if (!p || (!p.moved && Math.hypot(e.clientX - p.x0, e.clientY - p.y0) < 5)) return;
      p.moved = true;
      setDrag({ id: p.id, title: p.title, color: p.color, x: e.clientX, y: e.clientY, target: targetAt(e.clientX, e.clientY) });
    };
    const up = (e: PointerEvent) => {
      const p = press.current;
      press.current = null;
      if (!p?.moved) return;
      // The click that follows a drag isn't a tick.
      dragged.current = true;
      window.setTimeout(() => (dragged.current = false), 0);
      const t = e.type === "pointerup" ? targetAt(e.clientX, e.clientY) : null;
      if (t) moveRef.current(p.id, t.day, t.time, p.deadline);
      setDrag(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [start]);

  const grab = (t: DemoTask, deadline: boolean) => ({
    onPointerDown: (e: ReactPointerEvent) => {
      if (e.button !== 0) return;
      e.preventDefault();
      press.current = { id: t.id, title: t.title, color: projectOf(t.project)?.color, x0: e.clientX, y0: e.clientY, moved: false, deadline };
    },
    onClick: () => !dragged.current && onTick(t.id),
  });
  const lift = (t: DemoTask) => (drag?.id === t.id ? " lifted" : "");

  return (
    <div className={drag ? "ad-week dragging" : "ad-week"} role="group" aria-label={`Week of ${rangeLabel(start, start + 6)}`}>
      <p className="ad-week-tip">Drag a task to another day or hour. Click one to tick it off.</p>
      <div className="ad-week-cols" ref={cols}>
        <span />
        {days.map((d) => (
          <div key={d} className={["ad-week-day", d === 0 ? "today" : "", drag?.target?.day === d && drag.target.time === undefined ? "drop" : ""].join(" ")}>
            <b>{weekday(d)}</b> {dateOf(d).getDate()}
            <div className="ad-allday">
              {tasks
                .filter((t) => (t.day === d && t.time === undefined) || (t.deadline === d && t.deadlineTime === undefined && t.day !== d))
                .map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={(t.done ? "ad-chip done" : "ad-chip") + lift(t)}
                    style={{ borderColor: projectOf(t.project)?.color }}
                    aria-pressed={t.done}
                    {...grab(t, t.day !== d)}
                  >
                    {t.title}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
      <div className="ad-week-body" ref={body} style={{ height: HOURS.length * 40 }}>
        {HOURS.map((h) => (
          <span key={h} className="ad-week-hour" style={{ top: (h - 8) * 40 }}>
            {hourLabel(h)}
          </span>
        ))}
        {days.map((d, i) => (
          <div key={d} className={d === 0 ? "ad-week-col today" : "ad-week-col"} style={{ left: `calc(52px + (100% - 52px) * ${i} / 7)` }}>
            {eventsOn(d).map((e) => (
              <span key={e.title} className="ad-block event" style={{ top: ((e.start - 480) / 60) * 40, height: Math.max(18, ((e.end - e.start) / 60) * 40) }}>
                {e.title}
              </span>
            ))}
            {tasks
              .filter((t) => at(t, d) !== undefined)
              .map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={[t.done ? "ad-block done" : "ad-block", t.deadline === d && !(t.day === d && t.time !== undefined) ? "deadline" : ""].join(" ") + lift(t)}
                  style={{ top: ((at(t, d)! - 480) / 60) * 40, height: 30, borderColor: projectOf(t.project)?.color }}
                  aria-pressed={t.done}
                  {...grab(t, !(t.day === d && t.time !== undefined))}
                >
                  {t.title}
                </button>
              ))}
            {drag?.target?.day === d && drag.target.time !== undefined && (
              <span className="ad-drop" style={{ top: ((drag.target.time - 480) / 60) * 40, borderColor: drag.color }} aria-hidden>
                {timeLabel(drag.target.time)}
              </span>
            )}
          </div>
        ))}
      </div>
      {drag && (
        <div className="ad-ghost" style={{ left: drag.x + 14, top: drag.y + 14, borderColor: drag.color }} aria-hidden>
          <b>{drag.title}</b>
          <span>{drag.target ? `${dayLabel(drag.target.day)}${drag.target.time !== undefined ? ` · ${timeLabel(drag.target.time)}` : ""}` : "Drop it on a day"}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Inbox as a board: a column for each "when". Drag a card to another column
 * (mouse or finger) to give it that day; add a task right in a column.
 */
function Board({
  tasks,
  onTick,
  onMove,
  onAdd,
}: {
  tasks: DemoTask[];
  onTick: (id: number) => void;
  onMove: (id: number, col: Col) => void;
  onAdd: (col: Col, text: string) => void;
}) {
  const cols = useRef<(HTMLElement | null)[]>([]);
  const [drag, setDrag] = useState<{ id: number; title: string; x: number; y: number; over: Col | null } | null>(null);
  const press = useRef<{ id: number; title: string; x0: number; y0: number; moved: boolean } | null>(null);
  const [adding, setAdding] = useState<Col | null>(null);
  const [text, setText] = useState("");
  const moveRef = useRef(onMove);
  moveRef.current = onMove;

  useEffect(() => {
    const colAt = (x: number, y: number): Col | null => {
      const i = cols.current.findIndex((el) => {
        const r = el?.getBoundingClientRect();
        return !!r && x >= r.left && x <= r.right && y >= r.top - 40 && y <= r.bottom + 160;
      });
      return i < 0 ? null : COLS[i][0];
    };
    const move = (e: PointerEvent) => {
      const p = press.current;
      if (!p || (!p.moved && Math.hypot(e.clientX - p.x0, e.clientY - p.y0) < 5)) return;
      p.moved = true;
      setDrag({ id: p.id, title: p.title, x: e.clientX, y: e.clientY, over: colAt(e.clientX, e.clientY) });
    };
    const up = (e: PointerEvent) => {
      const p = press.current;
      press.current = null;
      if (!p?.moved) return;
      const c = e.type === "pointerup" ? colAt(e.clientX, e.clientY) : null;
      if (c) moveRef.current(p.id, c);
      setDrag(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  const hint = (c: Col) =>
    c === "today" ? `${weekday(0)} ${dateOf(0).getDate()}` : c === "tomorrow" ? `${weekday(1)} ${dateOf(1).getDate()}` : c === "week" ? `to ${weekday(7)} ${dateOf(7).getDate()}` : c === "someday" ? "no date" : "";

  return (
    <div className={drag ? "ad-board dragging" : "ad-board"}>
      {COLS.map(([c, name], i) => {
        const list = tasks.filter((t) => colOf(t) === c).sort((a, b) => (typeof a.day === "number" ? a.day : 99) - (typeof b.day === "number" ? b.day : 99) || (a.time ?? 9999) - (b.time ?? 9999));
        return (
          <section key={c} ref={(el) => (cols.current[i] = el)} className={drag?.over === c ? "ad-col drop" : "ad-col"} aria-label={name}>
            <h3>
              {name} <span>{list.length || ""}</span>
              <em>{hint(c)}</em>
            </h3>
            {list.map((t) => {
              const meta = metaOf(t, false);
              return (
                <div
                  key={t.id}
                  className={["ad-card", t.fresh ? "fresh" : "", drag?.id === t.id ? "lifted" : ""].join(" ")}
                  onPointerDown={(e) => {
                    if (e.button !== 0 || (e.target as HTMLElement).closest("button")) return;
                    e.preventDefault();
                    press.current = { id: t.id, title: t.title, x0: e.clientX, y0: e.clientY, moved: false };
                  }}
                >
                  <button type="button" className="ad-check" style={{ "--c": "#80868c" } as CSSProperties} aria-pressed={false} aria-label={`Done: ${t.title}`} onClick={() => onTick(t.id)}>
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
                    </svg>
                  </button>
                  <div>
                    <p>{t.title}</p>
                    {meta.length > 0 && (
                      <div className="ad-meta">
                        {meta.map((m) => (
                          <span key={m.text} className={m.tone ?? ""}>
                            {m.text}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {adding === c ? (
              <form
                className="ad-col-add"
                onSubmit={(e) => {
                  e.preventDefault();
                  onAdd(c, text);
                  setText("");
                }}
              >
                <label className="sr-only" htmlFor={`ad-col-${c}`}>
                  New task in {name}
                </label>
                <input
                  id={`ad-col-${c}`}
                  autoFocus
                  value={text}
                  maxLength={90}
                  autoComplete="off"
                  placeholder="Task name"
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Escape" && setAdding(null)}
                  onBlur={() => !text.trim() && setAdding(null)}
                />
              </form>
            ) : (
              <button type="button" className="ad-col-more" onClick={() => setAdding(c)}>
                + Add task
              </button>
            )}
          </section>
        );
      })}
      {drag && (
        <div className="ad-ghost" style={{ left: drag.x + 14, top: drag.y + 14 }} aria-hidden>
          <b>{drag.title}</b>
          <span>{drag.over ? COLS.find(([c]) => c === drag.over)![1] : "Drop it on a column"}</span>
        </div>
      )}
    </div>
  );
}
