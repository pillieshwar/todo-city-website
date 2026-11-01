/** Links and facts used across the site. */
export const SITE = {
  name: "TodoCity",
  tagline: "A private to-do app for Mac. Press ⌘C twice, and it's a task.",
  download: "https://github.com/pillieshwar/TodoCity/releases/latest/download/TodoCity-macOS.dmg",
  repo: "https://github.com/pillieshwar/TodoCity",
  releases: "https://github.com/pillieshwar/TodoCity/releases",
  issues: "https://github.com/pillieshwar/TodoCity/issues",
  security: "https://github.com/pillieshwar/TodoCity/security/policy",
  license: "https://github.com/pillieshwar/TodoCity/blob/main/LICENSE",
  requirements: "macOS 11 or later · Apple silicon and Intel",
};

/** The city's own page: its address and the words for search results. */
export const CITY = {
  path: "/city",
  title: "Your City: Every Task You Finish Lights a Window | TodoCity",
  description:
    "In TodoCity, each project is a building and each task a home. Finish a task and someone moves in: the lights come on. See how your city grows, with no streaks or points.",
};

/** The questions on the home page, also given to search engines. */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Is TodoCity free?",
    a: "Yes. TodoCity is free for personal, non-commercial use under the PolyForm Noncommercial license, and its source code is on GitHub for anyone to read.",
  },
  {
    q: "Does anything I capture leave my Mac?",
    a: "Not unless you turn something on. The AI that reads what you capture runs on your Mac, and your tasks live in one file on it, with no account and no tracking. The internet is used for the one-time model download and for update checks (you can turn those off). Sync between your Macs, two-way sync with Todoist and sharing with AI agents happen only after you turn them on.",
  },
  {
    q: "What do I need, and what does it download?",
    a: "A Mac with macOS 11 Big Sur or later, Apple silicon or Intel. The first time you open it, TodoCity downloads its AI model (about 2 GB) once. After that, capture works offline.",
  },
  {
    q: "Can I see my tasks on my iPhone?",
    a: "Yes, through Apple Reminders. Turn on Reminders sync in Settings → Connectors and your tasks appear in Reminders on your iPhone, both ways. TodoCity itself is a Mac app.",
  },
  {
    q: "Can I move my tasks from Things 3 or Todoist?",
    a: "Yes. In Settings → Connectors, TodoCity brings in your projects, headings or sections, tasks, checklists, dates, repeats and finished tasks, and keeps them in sync as you go: both ways with Todoist (or one-way, if you prefer), and flowing in from Things.",
  },
];

/** More questions people ask, on the FAQ page after the home page's. */
export const FAQ_MORE: { q: string; a: string }[] = [
  {
    q: "How do I turn text into a task?",
    a: "Select or copy any text (an email, a Slack message, a web page) and press ⌘C once more. TodoCity fills in the task, its day and its time; phrases like “by Friday 3pm” become a deadline and “every Sunday” a repeat.",
  },
  {
    q: "Can I use TodoCity on my work and personal Macs?",
    a: "Yes. Pair them with a code and six matching digits, and your tasks stay the same on both, with no iCloud or account needed. Changes are end-to-end encrypted on your Mac before they leave, so the relay that passes them along can't read them. You can keep any project on one Mac only.",
  },
  {
    q: "What does the city have to do with my to-do list?",
    a: "Every project is a building, its sections are floors, and every task is a home. When you finish a task, someone moves in and the lights come on, so over time your city shows everything you've done.",
  },
];

/** The site's address (canonical URL). */
export const ORIGIN = "https://todocity.app";
