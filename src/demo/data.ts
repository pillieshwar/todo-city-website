/**
 * The tasks, projects and date reading behind the try-it app in the hero.
 * Everything here is made up, and the demo's "today" is fixed (like a 9:41
 * on an iPhone ad) so the story reads the same on every visit.
 */

/** The demo's today: Thursday, October 29. Days are counted from here. */
const BASE = { year: 2026, month: 9, date: 29 };
export const TODAY_DOW = 4;
export const NOW_MIN = 9 * 60 + 41;

export interface Sub {
  title: string;
  done: boolean;
}

export interface DemoTask {
  id: number;
  title: string;
  /** A project's id; none = a task in no project (a house in the city). */
  project?: string;
  /** A section of its project; none = General (the ground floor). */
  section?: string;
  /** The day it's planned for, counted from today; none = Anytime. */
  day?: number | "someday";
  evening?: boolean;
  /** Minutes after midnight. */
  time?: number;
  deadline?: number;
  /** The deadline's time, minutes after midnight. */
  deadlineTime?: number;
  tag?: string;
  repeat?: string;
  source?: "Slack" | "Mail";
  notes?: string;
  sub?: Sub[];
  done: boolean;
  /** Finished before today (in the Logbook, not under Done). */
  earlier?: boolean;
  /** Just added in the demo: it glows until it's ticked. */
  fresh?: boolean;
}

export interface DemoProject {
  id: string;
  name: string;
  color: string;
  sections: string[];
}

export const GENERAL = "General";

export const PROJECTS: DemoProject[] = [
  { id: "launch", name: "Launch", color: "#a29bff", sections: [GENERAL, "Rollout", "Press"] },
  { id: "kitchen", name: "Kitchen remodel", color: "#f0b565", sections: [GENERAL, "Design", "Build"] },
  { id: "lisbon", name: "Lisbon trip", color: "#4ade80", sections: [GENERAL] },
  { id: "home", name: "Home", color: "#7cc7ff", sections: [GENERAL] },
];

export interface DemoEvent {
  title: string;
  day: number;
  start: number;
  end: number;
}

const MEETINGS: DemoEvent[] = [
  { title: "Design review", day: 0, start: 11 * 60, end: 12 * 60 },
  { title: "1:1 with Dana", day: 1, start: 14 * 60, end: 14 * 60 + 30 },
  { title: "Launch go/no-go", day: 5, start: 16 * 60, end: 16 * 60 + 45 },
];

/** Meetings from the Mac's calendar on a day: a standup every weekday, and a few others. */
export function eventsOn(day: number): DemoEvent[] {
  const dow = dateOf(day).getDay();
  const standup = dow > 0 && dow < 6 ? [{ title: "Standup", day, start: 9 * 60 + 30, end: 9 * 60 + 45 }] : [];
  return [...standup, ...MEETINGS.filter((m) => m.day === day)];
}

/** "Oct 29 to Nov 4": the days a week of the calendar shows. */
export function rangeLabel(from: number, to: number): string {
  const a = dateOf(from);
  const b = dateOf(to);
  return `${MONTHS[a.getMonth()]} ${a.getDate()} to ${MONTHS[b.getMonth()]} ${b.getDate()}`;
}

let nextId = 1;
export const newId = () => nextId++;
const t = (title: string, rest: Omit<DemoTask, "id" | "title" | "done"> & { done?: boolean } = {}): DemoTask => ({ id: newId(), title, done: false, ...rest });

export function startTasks(): DemoTask[] {
  return [
    t("Renew passport", { day: -5 }),
    t("Review the onboarding copy", { project: "launch", section: "Press", day: 0, time: 10 * 60, notes: "Keep it to three short screens." }),
    t("Book flights to Lisbon", { project: "lisbon", deadline: 0 }),
    t("Send Q3 numbers to Priya", { day: 0, time: 13 * 60 + 30, tag: "work", source: "Slack" }),
    t("Call the electrician", { project: "kitchen", section: "Build", day: 0, time: 14 * 60 }),
    t("Water the plants", { project: "home", day: 0, evening: true, repeat: "Every Sunday and Thursday", tag: "home" }),
    t("Call mom", { day: 0, evening: true }),
    t("Pay rent", { project: "home", day: 0, tag: "home", done: true }),
    t("Draft the press release", { project: "launch", section: "Press", done: true, earlier: true }),
    t("Write the launch FAQ", { project: "launch", done: true, earlier: true }),
    t("Set up the status page", { project: "launch", section: "Rollout", done: true, earlier: true }),
    t("Pick the rollout date", { project: "launch", section: "Rollout", done: true, earlier: true }),
    t("Brief support on the launch", { project: "launch", section: "Rollout", day: 2 }),
    t("Pitch two newsletters", { project: "launch", section: "Press" }),
    t("Measure the space", { project: "kitchen", done: true, earlier: true }),
    t("Pick paint colors", { project: "kitchen", section: "Design", done: true, earlier: true }),
    t("Choose the countertop", {
      project: "kitchen",
      section: "Design",
      sub: [
        { title: "Visit the showroom", done: true },
        { title: "Get three quotes", done: false },
        { title: "Order samples", done: false },
      ],
    }),
    t("Order cabinets", { project: "kitchen", section: "Build", day: 4 }),
    t("Find a hotel in Alfama", { project: "lisbon", day: 1 }),
    t("Back up the laptop", { project: "home", done: true, earlier: true }),
    t("Book a dentist appointment", { day: 1 }),
    t("Return the library books", { day: 4 }),
    t("Plan Priya's farewell lunch", { day: 12 }),
    t("Try the new ramen place"),
    t("Learn to sail", { day: "someday" }),
    t("Start a herb garden", { day: "someday" }),
  ];
}

// ── Dates ────────────────────────────────────────────────────────────────────

export function dateOf(offset: number): Date {
  return new Date(BASE.year, BASE.month, BASE.date + offset);
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const weekday = (offset: number, long = false) => {
  const w = WEEKDAYS[dateOf(offset).getDay()];
  return long ? w : w.slice(0, 3);
};
export const shortDate = (offset: number) => `${weekday(offset)}, ${MONTHS[dateOf(offset).getMonth()]} ${dateOf(offset).getDate()}`;

/** "Today", "Tomorrow", "Sat" for this week, else "Mon, Nov 9". */
export function dayLabel(offset: number): string {
  if (offset === 0) return "Today";
  if (offset === 1) return "Tomorrow";
  if (offset > 1 && offset < 7) return weekday(offset);
  return shortDate(offset);
}

export function timeLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

export const hourLabel = (h: number) => `${((h + 11) % 12) + 1} ${h < 12 ? "AM" : "PM"}`;

/** Days from today to the next such weekday (a week on if it's today). */
const toWeekday = (dow: number) => ((dow - TODAY_DOW + 7) % 7) || 7;

// ── Reading what you type ────────────────────────────────────────────────────

export interface Read {
  title: string;
  day?: number | "someday";
  evening?: boolean;
  time?: number;
  deadline?: number;
  deadlineTime?: number;
  tag?: string;
  project?: string;
  repeat?: string;
}

const DAY_WORD = /\b(today|tonight|this evening|tomorrow|someday|next week|(?:next |on )?(?:sun|mon|tues?|wed(?:nes)?|thu(?:rs)?|fri|sat(?:ur)?)(?:day)?)\b/i;
const TIME = /\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b|\bat\s+(\d{1,2})(?::(\d{2}))?\b|\b(noon)\b/i;
const EVERY = /\bevery\s+(day|week|month|weekday|(?:sun|mon|tues|wednes|thurs|fri|satur)day)\b/i;
const BY = /\b(?:by|before|due)\s+(today|tonight|tomorrow|(?:sun|mon|tues?|wed(?:nes)?|thu(?:rs)?|fri|sat(?:ur)?)(?:day)?)\b/i;

function dayFrom(word: string): { day: number | "someday"; evening?: boolean } | null {
  const w = word.toLowerCase().replace(/^(next|on)\s+/, "");
  if (w === "today") return { day: 0 };
  if (w === "tonight" || w === "this evening") return { day: 0, evening: true };
  if (w === "tomorrow") return { day: 1 };
  if (w === "someday") return { day: "someday" };
  if (w === "next week") return { day: toWeekday(1) };
  // Only real day names: "month" starts like "mon" but isn't Monday.
  if (!/^(sun|mon|tues?|wed(nes)?|thu(rs)?|fri|sat(ur)?)(day)?$/.test(w)) return null;
  return { day: toWeekday(["sun", "mon", "tue", "wed", "thu", "fri", "sat"].indexOf(w.slice(0, 3))) };
}

/**
 * The quick-add reading: "pay rent friday 5pm every month #home" becomes a
 * title, a day, a time, a repeat and a project — the way the app reads it.
 */
export function readTask(text: string, projects: DemoProject[] = PROJECTS): Read {
  let rest = ` ${text} `;
  const out: Read = { title: "" };
  const cut = (m: RegExpMatchArray) => {
    rest = rest.replace(m[0], " ");
  };

  for (const m of rest.matchAll(/(?:^|\s)[#@]([\p{L}\d-]+)/gu)) {
    const word = m[1].toLowerCase();
    const p = projects.find((p) => p.id === word || p.name.toLowerCase().replace(/\s+/g, "").startsWith(word));
    if (p && !out.project) out.project = p.id;
    else if (!out.tag) out.tag = m[1];
    else continue;
    rest = rest.replace(m[0], " ");
  }

  // "every Sunday" sets the day; "every month" leaves it to a day word, else today.
  const every = rest.match(EVERY);
  const everyDay = every ? dayFrom(every[1]) : null;
  if (every) {
    const w = every[1].toLowerCase();
    out.repeat = `Every ${everyDay ? w[0].toUpperCase() + w.slice(1) : w}`;
    out.day = everyDay?.day ?? 0;
    cut(every);
  }

  const by = rest.match(BY);
  if (by) {
    const d = dayFrom(by[1]);
    if (d && typeof d.day === "number") out.deadline = d.day;
    cut(by);
  }

  const day = rest.match(DAY_WORD);
  if (day && !everyDay) {
    const d = dayFrom(day[1]);
    if (d) {
      out.day = d.day;
      if (d.evening) out.evening = true;
      cut(day);
    }
  }

  const time = rest.match(TIME);
  if (time) {
    let h: number;
    let m = 0;
    if (time[6]) h = 12;
    else if (time[1]) {
      h = Number(time[1]) % 12;
      m = Number(time[2] ?? 0);
      if (time[3].toLowerCase() === "pm") h += 12;
    } else {
      h = Number(time[4]);
      m = Number(time[5] ?? 0);
      // "at 3" means the afternoon.
      if (h < 8) h += 12;
    }
    if (h < 24 && m < 60) {
      if (out.deadline !== undefined && !day) out.deadlineTime = h * 60 + m;
      else {
        out.time = h * 60 + m;
        if (out.day === undefined) out.day = 0;
      }
      cut(time);
    }
  }

  const title = rest.replace(/\s+/g, " ").trim();
  out.title = title ? title[0].toUpperCase() + title.slice(1) : "";
  return out;
}

/** The finished tasks: the city's population. */
export const population = (tasks: DemoTask[], base = 0) => base + tasks.filter((x) => x.done).length;
