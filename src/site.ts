/** Links and facts used across the site. */
export const SITE = {
  name: "TodoCity",
  tagline: "Every task is a home. Finish it, and the lights come on.",
  download: "https://github.com/pillieshwar/TodoCity/releases/latest/download/TodoCity-macOS.dmg",
  repo: "https://github.com/pillieshwar/TodoCity",
  releases: "https://github.com/pillieshwar/TodoCity/releases",
  issues: "https://github.com/pillieshwar/TodoCity/issues",
  security: "https://github.com/pillieshwar/TodoCity/security/policy",
  license: "https://github.com/pillieshwar/TodoCity/blob/main/LICENSE",
  requirements: "macOS 11 or later · Apple silicon and Intel",
};

/** Questions people ask, answered on the page and given to search engines. */
export const FAQ: { q: string; a: string }[] = [
  {
    q: "Is TodoCity free?",
    a: "Yes. TodoCity is free for personal, non-commercial use under the PolyForm Noncommercial license, and its source code is on GitHub for anyone to read.",
  },
  {
    q: "Does anything I capture leave my Mac?",
    a: "No. The AI that reads your text is a small language model that runs on your own Mac, and your tasks are stored in a file on it. There's no account and no tracking. The internet is used only for the one-time model download, checking for updates (you can turn that off), and sync between your Macs if you turn it on.",
  },
  {
    q: "How do I turn text into a task?",
    a: "Select or copy any text — an email, a Slack message, a web page — and press ⌘C once more. TodoCity fills in the task, its day and its time; phrases like “by Friday 3pm” become a deadline and “every Sunday” a repeat.",
  },
  {
    q: "Which Macs does it run on?",
    a: "Any Mac with macOS 11 Big Sur or later, Apple silicon or Intel. The first time you open it, TodoCity downloads its AI model (about 2 GB) once.",
  },
  {
    q: "Can I use TodoCity on my work and personal Macs?",
    a: "Yes. Pair them with a code and six matching digits, and your tasks stay the same on both — no iCloud or account needed. Changes are end-to-end encrypted on your Mac before they leave, so the relay that passes them along can't read them. You can keep any project on one Mac only.",
  },
  {
    q: "Can I move my tasks from Things 3 or Todoist?",
    a: "Yes. In Settings → Import Data, TodoCity brings in your projects, headings or sections, tasks, checklists, dates, repeats and finished tasks — and can keep them in sync as you go. Things and Todoist aren't changed.",
  },
  {
    q: "What does the city have to do with my to-do list?",
    a: "Every project is a building, its sections are floors, and every task is a home. When you finish a task, someone moves in and the lights come on — so over time your city shows everything you've done.",
  },
];

/** The site's address (canonical URL). */
export const ORIGIN = "https://todocity.app";
