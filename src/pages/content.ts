/**
 * The guide pages: each answers one question people search for (or ask an
 * AI assistant), with a direct answer first and the details after. Pages
 * are prerendered to plain HTML with their own title, description and
 * structured data (scripts/prerender.mjs).
 */

export type Block =
  | { p: string }
  | { list: string[] }
  | { steps: { title: string; text: string }[] }
  | { table: { head: string[]; rows: string[][]; caption: string } }
  | { note: string };

export interface Section {
  h2: string;
  blocks: Block[];
}

export interface Page {
  slug: string;
  kind: "guide" | "compare" | "howto";
  /** The <title> (under ~60 characters). */
  title: string;
  /** The meta description (under ~155 characters). */
  description: string;
  h1: string;
  /** The short, direct answer: the first thing on the page. */
  answer: string;
  /** Facts at a glance, as label → value. */
  facts?: [string, string][];
  sections: Section[];
  faq?: { q: string; a: string }[];
  /** Other pages to read next, by slug. */
  related: string[];
  /** For the guides list. */
  card: string;
}

/** When the pages were last checked against the app. */
export const UPDATED = "2026-10-27";

const FACTS_APP: [string, string][] = [
  ["Price", "Free for personal use"],
  ["Runs on", "macOS 11 or later, Apple silicon and Intel"],
  ["AI", "A small language model on your Mac"],
  ["AI agents", "Built-in MCP server: add-only, or full access if you turn it on"],
  ["Account", "None"],
  ["Sync", "Mac to Mac, end-to-end encrypted (optional)"],
];

export const PAGES: Page[] = [
  {
    slug: "private-todo-app-for-mac",
    kind: "guide",
    title: "A Private To-Do App for Mac, With No Account · TodoCity",
    description:
      "TodoCity is a private to-do app for Mac: tasks live in a file on your Mac, the AI runs on your Mac, and there's no account, cloud or tracking.",
    h1: "A private to-do app for Mac",
    answer:
      "TodoCity is a to-do app for Mac that keeps everything on your Mac. Your tasks are stored in one file on your own computer, the AI that turns text into tasks runs locally, and there is no account, no cloud and no analytics. It's private by default: nothing leaves your Mac unless you turn it on. It's free for personal use.",
    facts: FACTS_APP,
    card: "What stays on your Mac, what (rarely) goes online, and why there's no account.",
    sections: [
      {
        h2: "What stays on your Mac",
        blocks: [
          {
            list: [
              "Every task, note, sub-task, project and date, in one SQLite file in your Library folder, with seven daily backups beside it.",
              "Everything you capture. Selected text goes only to a model running on your Mac (on 127.0.0.1, with a new random port and key each session).",
              "Your reminders. Notifications are scheduled by macOS itself, not by a server.",
              "Your city (the 3D picture of everything you've finished) is drawn on your Mac.",
            ],
          },
        ],
      },
      {
        h2: "When TodoCity goes online",
        blocks: [
          { p: "Only for three things, and you control each one:" },
          {
            list: [
              "Downloading the AI model once, when you set it up (from Hugging Face, checked against its SHA-256).",
              "Checking GitHub for updates. You can turn this off in Settings → General.",
              "Sync between your Macs, only if you pair them. Changes are encrypted on your Mac before they leave, and the relay that passes them along can't read them.",
            ],
          },
          { p: "There are no accounts, analytics or telemetry. Nothing is sent about how you use the app." },
        ],
      },
      {
        h2: "Why no account?",
        blocks: [
          {
            p: "An account is how most to-do apps sync and how they know who you are. TodoCity doesn't need either: your tasks are on your Mac, and if you use more than one Mac, they pair directly with a code, like pairing headphones, instead of signing in. That also means it works on a work Mac that can't sign in to iCloud.",
          },
        ],
      },
      {
        h2: "Your data, in your hands",
        blocks: [
          {
            list: [
              "Export everything to CSV or JSON at any time (Settings → Backups & export).",
              "Seven days of automatic backups, and one before every import.",
              "The source code is public on GitHub, so anyone can check what the app does.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: "Does TodoCity work offline?",
        a: "Yes. Once the AI model is downloaded, capturing, planning, reminders and your city all work with no internet connection. Only sync between Macs and update checks need the internet.",
      },
      {
        q: "Can my employer or anyone else see my tasks?",
        a: "TodoCity sends your tasks nowhere unless you turn something on. If you pair Macs, changes travel end-to-end encrypted; the relay can't read task titles, notes, projects or Mac names. You can also keep any project on one Mac only.",
      },
    ],
    related: ["ai-todo-app-on-device", "sync-macs-without-icloud", "faq"],
  },
  {
    slug: "ai-todo-app-on-device",
    kind: "guide",
    title: "A To-Do App With On-Device AI for Mac · TodoCity",
    description:
      "TodoCity's AI runs on your Mac, not in the cloud: it reads the text you capture and writes the task, its date, time and repeat. Works offline.",
    h1: "A to-do app with AI that runs on your Mac",
    answer:
      "TodoCity uses a small language model that runs entirely on your Mac. When you capture text (an email, a Slack message, a web page), it writes the to-do and finds the date phrase, and TodoCity turns that into a real day, time, deadline or repeat. Nothing you capture is sent to an AI service.",
    facts: [
      ["Model", "A small open model, downloaded once (about 2 GB)"],
      ["Where it runs", "On your Mac, through llama.cpp"],
      ["Internet needed", "Only for the first download"],
      ["Macs", "Apple silicon and Intel, macOS 11+"],
    ],
    card: "How the local model writes your tasks, and why it stays safe with any text.",
    sections: [
      {
        h2: "What the AI does, and doesn't",
        blocks: [
          {
            p: "The model has one small job: read what you captured and return three things: the task, the date phrase it found (“by Friday 3pm”), and how sure it is. Plain code then works out the actual date against today's calendar, so dates are never “hallucinated”. If a phrase could mean two days (“next Friday” on a Tuesday), TodoCity asks you instead of guessing.",
          },
          {
            list: [
              "“by Friday 3pm” becomes Friday at 3:00 PM, with a deadline.",
              "“every Sunday” becomes a weekly repeat.",
              "A bulleted list becomes sub-tasks.",
              "The task remembers where it came from (the Slack thread, the email or the page) and opens it in one click.",
            ],
          },
        ],
      },
      {
        h2: "How it runs on your Mac",
        blocks: [
          {
            p: "On first launch, TodoCity recommends a model for your Mac and downloads it once. It starts the model only when you capture something and stops it after five idle minutes, so it doesn't hold on to memory. Developers can point it at an existing Ollama instead.",
          },
        ],
      },
      {
        h2: "Safe with text you don't control",
        blocks: [
          {
            p: "Captured text is treated as data, never as instructions: it's wrapped and cleaned, the instructions live only in the system prompt, and the answer must match a strict schema. The most any message can do is suggest a task for you to review. It can't make TodoCity do anything else.",
          },
        ],
      },
      {
        h2: "Optional AI extras",
        blocks: [
          {
            list: [
              "Watch my screen (off by default) suggests tasks from what's in front of you (asks of you and promises you made) using the same on-device model. Password managers, Keychain, System Settings and terminals are never read.",
              "AI agents like Claude Code, Claude Desktop, Cursor and VS Code can add tasks over MCP, on your Mac only, and you approve each one. Turn on Full access and they can run your whole list: read, add, change, schedule and complete tasks, projects and sections.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: "Does TodoCity use ChatGPT or another cloud AI?",
        a: "No. The model runs on your Mac. Text you capture isn't sent to OpenAI, Anthropic, Google or anyone else.",
      },
      {
        q: "Will it slow my Mac down?",
        a: "The model runs only while it reads a capture, usually a second or two, and stops after five idle minutes. TodoCity picks a model size that suits your Mac.",
      },
    ],
    related: ["ai-agents-mcp-todo-app", "turn-text-into-tasks", "private-todo-app-for-mac"],
  },
  {
    slug: "ai-agents-mcp-todo-app",
    kind: "guide",
    title: "A To-Do App With MCP for AI Agents, on Mac · TodoCity",
    description:
      "TodoCity has a built-in MCP server: Claude, Cursor and VS Code can add tasks for your OK, or, with full access, run your whole list. Plus a background agent for email.",
    h1: "A to-do app built for AI agents",
    answer:
      "TodoCity is a Mac to-do app made for the age of AI assistants. Its built-in MCP server lets Claude Code, Claude Desktop, Cursor, VS Code, Windsurf and LM Studio add tasks for you, each waiting for your OK. Turn on Full access and they can run your list for you: read, add, change, schedule to the minute, complete and delete tasks, sub-tasks, reminders, projects and sections, with 28 tools. It can also run Claude Code in the background, on a schedule, to pull the to-dos out of your new email. And TodoCity's own AI runs on your Mac.",
    facts: [
      ["MCP server", "Built in: add_task, or 28 tools with full access"],
      ["AI apps", "Claude Code, Claude Desktop, Cursor, VS Code, Windsurf, LM Studio"],
      ["Access", "Add-only (you approve each task) or full access: your choice"],
      ["Where it works", "On this Mac only, over a private local connection"],
    ],
    card: "MCP for Claude, Cursor and VS Code, add-only or full access, and an agent that turns email into tasks.",
    sections: [
      {
        h2: "Three kinds of AI, each with one job",
        blocks: [
          {
            list: [
              "On-device AI reads what you capture (⌘C twice) and writes the task with its date and repeat, offline and never sent to a cloud AI.",
              "The AI apps you already use add tasks over MCP: tell Claude “add a TodoCity task to send the deck Friday 3pm”.",
              "A background agent checks your new email on a schedule and sends you the to-dos it finds, for review.",
            ],
          },
        ],
      },
      {
        h2: "Connect an AI app",
        blocks: [
          {
            steps: [
              { title: "Open Connectors", text: "In TodoCity, open Settings → Connectors → AI agents and turn on “Let AI agents on this Mac add tasks”." },
              { title: "Pick your app", text: "Click Connect next to Claude Code, Claude Desktop, Cursor, VS Code, Windsurf or LM Studio. TodoCity adds itself to that app's MCP settings and backs up the original first." },
              { title: "Ask for a task", text: "In the AI app, say “add a TodoCity task to call the bank tomorrow at 10”." },
              { title: "Approve it", text: "The task waits in the menu-bar dropdown. Add puts it on your list; Dismiss drops it." },
            ],
          },
          {
            p: "Prefer agents to notice deadlines on their own? Turn on “Let agents suggest tasks on their own”: when you mention a deadline or say “remind me”, they send it to TodoCity without being asked. You still approve each one.",
          },
        ],
      },
      {
        h2: "Add-only, or full access: you choose",
        blocks: [
          {
            p: "Out of the box, agents get one tool, add_task, and the same reply for every task (no ids, no counts, no duplicate check), so an agent learns nothing about your list. At most 20 tasks arrive every 10 minutes, and 50 can wait for review.",
          },
          {
            p: "Turn on Full access (Settings → Connectors → AI agents) and agents get 28 tools to run your list on their own: read and search tasks, add and change them, schedule them to the minute with a length, snooze reminders, tick off sub-tasks, complete, delete, and manage projects and sections. Changes apply right away. What an agent reads, it may send to its AI service, as with anything you share with it.",
          },
          {
            p: "Either way, TodoCity talks to agents over a private connection that only your Mac user account can open, so agents in the cloud can't reach it on their own.",
          },
        ],
      },
      {
        h2: "A background agent for your email",
        blocks: [
          {
            p: "Turn on Email to tasks and TodoCity runs Claude Code on a schedule: every 15, 30 or 60 minutes, between the hours you choose, weekdays only if you like. Claude Code reads your new mail through your own mail connection and sends the action items to TodoCity, where they wait for review like any other agent task. The run may use only your mail connection and add_task, and TodoCity itself never reads your mail.",
          },
          {
            note: "Email to tasks needs Claude Code on your Mac, connected to TodoCity and to your mail (for example an Outlook or Microsoft 365 MCP server). Your email is read by Claude Code under your own Claude account; TodoCity only receives the tasks.",
          },
        ],
      },
      {
        h2: "How it compares",
        blocks: [
          {
            table: {
              caption: "AI agents in TodoCity, Things 3, Todoist and Apple Reminders",
              head: ["Feature", "TodoCity", "Things 3", "Todoist", "Apple Reminders"],
              rows: [
                ["MCP server for AI apps", "Built in, on your Mac", "No official one", "Official, in the cloud", "No official one"],
                ["What agents can do", "Add tasks only, approved by you", "Nothing", "Read and change your tasks", "Nothing"],
                ["Background AI agent", "Email to tasks, on a schedule", "No", "No", "No"],
                ["AI on your device", "Yes, any Mac with macOS 11+", "No", "No (cloud)", "Apple Intelligence on supported Macs"],
              ],
            },
          },
        ],
      },
    ],
    faq: [
      {
        q: "Which AI apps can add tasks to TodoCity?",
        a: "Claude Code, Claude Desktop, Cursor, VS Code, Windsurf and LM Studio connect in one click from Settings → Connectors → AI agents. Any other app that supports local (stdio) MCP servers can run TodoCity --mcp.",
      },
      {
        q: "Can an AI agent see my tasks?",
        a: "Only if you turn on Full access. By default TodoCity's MCP server is add-only: agents can add a task, every task gets the same reply, and they can't read, change, delete or count your tasks. With Full access on, connected agents can read and change your list.",
      },
      {
        q: "Does the background agent send my email anywhere?",
        a: "TodoCity never reads your email. Claude Code reads it through the mail connection you set up in Claude Code, under your Claude account, the same as if you asked it yourself. TodoCity only receives the tasks it finds.",
      },
    ],
    related: ["ai-todo-app-on-device", "todoist-alternative", "things-3-alternative"],
  },
  {
    slug: "turn-text-into-tasks",
    kind: "howto",
    title: "Turn Any Text Into a Task on Mac (Email, Slack, Web) · TodoCity",
    description:
      "Copy any text on your Mac and press ⌘C again: TodoCity turns it into a task with its date, time and repeat. Works in every app: email, Slack, the web.",
    h1: "How to turn any text into a task on your Mac",
    answer:
      "In TodoCity, copy any text and press ⌘C once more. A card drops down from the menu bar with the task, its day and its time already filled in; press Return to save it. It works in every app: Mail, Outlook, Slack, Messages, a web page or a PDF.",
    card: "⌘C twice, a shortcut, or right-click: three ways to capture from any app.",
    sections: [
      {
        h2: "Capture with ⌘C twice",
        blocks: [
          {
            steps: [
              { title: "Copy the text", text: "Select a message, an email or a line on a web page and press ⌘C, as usual." },
              { title: "Press ⌘C again", text: "Within a moment, press ⌘C a second time. TodoCity reads what you copied on your Mac." },
              { title: "Check the card", text: "A card drops down from the menu bar with the task, its date and time filled in. Change anything you like." },
              { title: "Press Return", text: "The task is saved, and you'll be reminded when its time comes, with Done and Snooze one click away." },
            ],
          },
        ],
      },
      {
        h2: "Other ways to capture",
        blocks: [
          {
            list: [
              "A shortcut: select text and press ⇧⌘S, no copying at all. (This needs Accessibility access, which is how macOS lets an app read selected text.)",
              "Right-click → Services → Add to TodoCity, in apps that offer it.",
              "Quick add: press ⇧⌘Space anywhere and type, e.g. “pay rent friday 5pm every month #home”.",
              "In the capture card, pick the project and section it goes in.",
            ],
          },
        ],
      },
      {
        h2: "Dates it understands",
        blocks: [
          {
            table: {
              caption: "Phrases and what they become",
              head: ["You write", "TodoCity makes"],
              rows: [
                ["by Friday 3pm", "Friday, 3:00 PM, with a deadline"],
                ["tomorrow evening", "Tomorrow, this evening"],
                ["every Monday", "A weekly repeat on Mondays"],
                ["next tuesday at 9", "Next Tuesday, 9:00 AM"],
                ["3/4", "Asks: March 4 or April 3?"],
              ],
            },
          },
        ],
      },
    ],
    faq: [
      {
        q: "Does ⌘C twice change my clipboard?",
        a: "No. Copying works as usual. TodoCity only reads what you just copied when you press ⌘C again; copies made inside TodoCity itself are ignored.",
      },
    ],
    related: ["ai-todo-app-on-device", "work-and-personal-tasks", "faq"],
  },
  {
    slug: "things-3-alternative",
    kind: "compare",
    title: "Things 3 Alternative for Mac: TodoCity vs Things 3",
    description:
      "Looking for a Things 3 alternative on Mac? TodoCity is free, captures tasks from any text with on-device AI, and imports your Things library.",
    h1: "TodoCity vs Things 3: a Things alternative for Mac",
    answer:
      "TodoCity is a free alternative to Things 3 for people who live on a Mac. It keeps Things' ideas (Today, Upcoming, Anytime, Someday, projects with headings, deadlines) and adds on-device AI that turns any copied text into a dated task, plus a 3D city that grows as you finish things. Things 3 is the better pick if you need iPhone, iPad and Apple Watch apps. TodoCity can bring your whole Things library over in one step.",
    card: "What carries over, what's different, and who should pick which.",
    sections: [
      {
        h2: "At a glance",
        blocks: [
          {
            table: {
              caption: "TodoCity and Things 3 compared",
              head: ["Feature", "TodoCity", "Things 3"],
              rows: [
                ["Price", "Free for personal use", "Paid, one-time, per platform"],
                ["Platforms", "Mac", "Mac, iPhone, iPad, Apple Watch"],
                ["Turn any text into a task", "Yes: ⌘C twice, on-device AI", "Share sheet and Quick Entry (no AI)"],
                ["AI that runs on your Mac", "Yes, works offline", "No AI features"],
                ["AI apps and your tasks (MCP)", "Built in: Claude, Cursor, VS Code and more; add-only with your OK, or full access", "No official MCP server (community ones exist)"],
                ["Background AI agent", "Yes: checks new email on a schedule and sends the to-dos for review", "No"],
                ["Dates from plain words", "Yes, with deadlines and repeats", "Typed dates in the When field"],
                ["Projects and sections", "Projects with sections, like Slack channels", "Projects with headings, and areas"],
                ["Sync", "Mac to Mac, end-to-end encrypted, no account", "Things Cloud (account)"],
                ["Calendar beside your tasks", "Yes, with hours to drag tasks onto", "Calendar events in Today and Upcoming"],
                ["Work / personal modes", "Yes, per Mac", "Via areas"],
                ["Import from the other", "Imports your Things library", "No"],
                ["Source code", "Public on GitHub", "Closed"],
              ],
            },
          },
        ],
      },
      {
        h2: "What feels familiar",
        blocks: [
          {
            p: "If you know Things, you'll find your way: Today (with This Evening), a calendar for what's coming, an Inbox for tasks in no project, Someday and Completed. Projects have sections and tasks have notes, checklists, a separate deadline and repeats.",
          },
        ],
      },
      {
        h2: "What's different",
        blocks: [
          {
            list: [
              "Capture from anywhere with AI: copy a message and press ⌘C again, and the task arrives with its date filled in.",
              "Plan on the clock: drag a task onto an hour of today or a day of the week, beside your calendar events.",
              "Overdue has its own list, instead of tasks quietly rolling over.",
              "Modes: show only work projects on your work Mac, and everything at home.",
              "Your city: every project is a building and every finished task lights a window. No streaks, no points.",
            ],
          },
        ],
      },
      {
        h2: "Built for the AI era",
        blocks: [
          {
            list: [
              "AI apps you already use (Claude Code, Claude Desktop, Cursor, VS Code, Windsurf, LM Studio) can add tasks through TodoCity's built-in MCP server. Ask “add a TodoCity task to send the deck Friday 3pm” and it's done.",
              "Your choice of access: add-only, where each task waits in the menu bar for your OK, or full access, where agents read and run your list for you.",
              "A background agent: TodoCity can run Claude Code on a schedule to find the to-dos in your new email and send them to you for review.",
              "Its own AI runs on your Mac, so what you capture never goes to a cloud AI.",
            ],
          },
        ],
      },
      {
        h2: "Who should pick which",
        blocks: [
          {
            list: [
              "Pick TodoCity if you work mainly on a Mac, capture tasks from messages and email, want AI without the cloud, or want Claude and your other AI tools to add tasks for you, or need to sync a work Mac without iCloud.",
              "Pick Things 3 if you add tasks on your iPhone or Apple Watch, or rely on Things' areas and iOS widgets.",
              "Not sure? Try both: TodoCity reads a copy of your Things database and doesn't change Things, so you can keep using it.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: "Can I move from Things 3 to TodoCity?",
        a: "Yes. Settings → Import Data reads a copy of your Things 3 database on your Mac and brings projects, headings, to-dos, checklists, dates, deadlines, repeats, tags and your Logbook. Things isn't changed.",
      },
      {
        q: "Does TodoCity have an iPhone app?",
        a: "TodoCity is a Mac app. You can turn on two-way Apple Reminders sync to see and tick off tasks on your iPhone through Reminders.",
      },
    ],
    related: ["move-from-things-3", "ai-agents-mcp-todo-app", "todoist-alternative", "apple-reminders-alternative"],
  },
  {
    slug: "todoist-alternative",
    kind: "compare",
    title: "Todoist Alternative for Mac, Private and Offline · TodoCity",
    description:
      "A private Todoist alternative for Mac: no account or cloud, on-device AI that turns text into tasks, and a one-step import of your Todoist projects.",
    h1: "TodoCity vs Todoist: a private Todoist alternative for Mac",
    answer:
      "TodoCity is a private, Mac-only alternative to Todoist. Where Todoist keeps your tasks in its cloud behind an account, TodoCity keeps them on your Mac, works offline and uses on-device AI to turn copied text into dated tasks. Todoist is the better pick if you need apps on every platform or shared projects with a team. TodoCity can import your Todoist projects, sections, tasks and completed tasks.",
    card: "Cloud and account vs on your Mac: the trade-offs, and how to move.",
    sections: [
      {
        h2: "At a glance",
        blocks: [
          {
            table: {
              caption: "TodoCity and Todoist compared",
              head: ["Feature", "TodoCity", "Todoist"],
              rows: [
                ["Price", "Free for personal use", "Free plan, paid plans for more"],
                ["Platforms", "Mac", "Web, Mac, Windows, iPhone, Android and more"],
                ["Where tasks live", "On your Mac", "Todoist's servers"],
                ["Account", "None", "Required"],
                ["Works offline", "Fully", "Partly"],
                ["AI", "On your Mac, works offline", "Cloud features"],
                ["AI apps and your tasks (MCP)", "Built in, on your Mac: add-only with your OK, or full access", "Official MCP server in the cloud, and agents can read and change your tasks"],
                ["Background AI agent", "Yes: checks new email on a schedule and sends the to-dos for review", "No, forward each email yourself"],
                ["Turn copied text into a task", "⌘C twice, in any app", "Browser extensions, email forwarding, share sheet"],
                ["Sharing with others", "No", "Yes, shared projects"],
                ["Import from the other", "Imports Todoist (API token or CSV)", "No"],
              ],
            },
          },
        ],
      },
      {
        h2: "Why people switch",
        blocks: [
          {
            list: [
              "Privacy: no account and no cloud copy of your tasks.",
              "Capture from any app with ⌘C twice, read by AI on your Mac.",
              "Planning on the clock: Today with its hours and a week calendar beside your events.",
              "A work Mac that can't use cloud apps can still sync with your personal Mac, end-to-end encrypted.",
              "A calmer kind of motivation: your city lights up as you finish things, with no karma points or streaks.",
            ],
          },
        ],
      },
      {
        h2: "AI agents, on your terms",
        blocks: [
          {
            p: "Both apps work with AI assistants over MCP, but in opposite ways. Todoist's MCP server lives in the cloud and lets an agent read and change your account. TodoCity's runs on your Mac and starts add-only: Claude, Cursor, VS Code and other AI apps can add tasks, can't see a thing, and every task waits for your OK. Turn on Full access and they can read and change your list too, still through your Mac.",
          },
          {
            p: "TodoCity can also work in the background: turn on Email to tasks and it runs Claude Code on a schedule to find the to-dos in your new email and send them to you for review. TodoCity itself never reads your mail.",
          },
        ],
      },
      {
        h2: "What carries over",
        blocks: [
          {
            table: {
              caption: "Todoist in TodoCity",
              head: ["Todoist", "TodoCity"],
              rows: [
                ["Project (and sub-projects)", "Project"],
                ["Inbox", "Tasks with no project"],
                ["Section", "Section"],
                ["Sub-tasks", "Sub-tasks"],
                ["Labels", "#tags"],
                ["Priority 1–3", "Priority P1–P3"],
                ["Description and comments", "Notes"],
                ["Recurring dates", "Repeats (daily, weekdays, weekly, every 2 weeks, monthly, yearly)"],
                ["Completed tasks", "Done tasks: lit windows in your city"],
              ],
            },
          },
        ],
      },
      {
        h2: "Who should pick which",
        blocks: [
          {
            list: [
              "Pick TodoCity if your tasks are personal, you work on a Mac, and you'd rather they never leave it.",
              "Pick Todoist if you need Windows, Android or the web, or share projects with other people.",
            ],
          },
        ],
      },
    ],
    faq: [
      {
        q: "How do I move from Todoist to TodoCity?",
        a: "In TodoCity, open Settings → Import Data → Todoist and paste your Todoist API token (Todoist → Settings → Integrations → Developer). Or export projects as CSV files. Todoist isn't changed.",
      },
    ],
    related: ["move-from-todoist", "ai-agents-mcp-todo-app", "things-3-alternative", "private-todo-app-for-mac"],
  },
  {
    slug: "apple-reminders-alternative",
    kind: "compare",
    title: "Apple Reminders Alternative for Mac (That Syncs With It) · TodoCity",
    description:
      "TodoCity works alongside Apple Reminders on Mac: AI capture from any text, projects, deadlines and planning by the hour, with two-way Reminders sync.",
    h1: "TodoCity vs Apple Reminders",
    answer:
      "Apple Reminders is free and on every Apple device; TodoCity is a Mac app for people who want more: tasks from any copied text with on-device AI, projects with sections, separate deadlines, a calendar with hours to plan on, and modes for work and personal. You don't have to choose: TodoCity can sync both ways with a Reminders list, so your tasks also show on your iPhone.",
    card: "Use it with Reminders, not instead: two-way sync and what TodoCity adds.",
    sections: [
      {
        h2: "At a glance",
        blocks: [
          {
            table: {
              caption: "TodoCity and Apple Reminders compared",
              head: ["Feature", "TodoCity", "Apple Reminders"],
              rows: [
                ["Price", "Free for personal use", "Free, built in"],
                ["Platforms", "Mac (iPhone through Reminders sync)", "Every Apple device"],
                ["Turn any text into a task", "⌘C twice, on-device AI", "Siri, the share sheet, and Apple Intelligence suggestions"],
                ["AI", "On your Mac, on any Mac with macOS 11+", "Apple Intelligence, on supported Macs with macOS 26"],
                ["AI apps and your tasks (MCP)", "Built in: Claude, Cursor, VS Code and more; add-only with your OK, or full access", "No official MCP server"],
                ["Background AI agent", "Yes: checks new email on a schedule and sends the to-dos for review", "No"],
                ["Deadline separate from the planned day", "Yes", "No"],
                ["Plan tasks by the hour beside your calendar", "Yes, drag onto an hour", "Timed reminders show in Calendar"],
                ["Projects with sections", "Projects with sections, like Slack channels", "Lists with sections"],
                ["Work / personal modes", "Yes, per Mac", "Separate lists"],
                ["Shared lists", "No", "Yes, through iCloud"],
              ],
            },
          },
        ],
      },
      {
        h2: "Using both: two-way Reminders sync",
        blocks: [
          {
            p: "In Settings → Connectors → Apple Reminders, pick a list. Tasks you add in either app appear in the other, and ticking one off ticks off both. It's off until you turn it on.",
          },
          {
            note: "If the list you pick is stored in iCloud, those tasks travel through iCloud, and TodoCity tells you first. Pick an “On My Mac” list to keep them fully local.",
          },
        ],
      },
      {
        h2: "What TodoCity adds for AI",
        blocks: [
          {
            list: [
              "A built-in MCP server: Claude Code, Claude Desktop, Cursor, VS Code, Windsurf and LM Studio can add tasks for you to approve, or, with Full access, run your whole list.",
              "A background agent that checks your new email on a schedule and sends the to-dos for review.",
              "On-device AI that works on any Mac with macOS 11 or later, with no Apple Intelligence needed.",
            ],
          },
        ],
      },
    ],
    related: ["things-3-alternative", "ai-agents-mcp-todo-app", "todoist-alternative", "work-and-personal-tasks"],
  },
  {
    slug: "move-from-things-3",
    kind: "howto",
    title: "How to Move From Things 3 to TodoCity (Step by Step)",
    description:
      "Move your Things 3 library to TodoCity in a few steps: projects, headings, to-dos, checklists, deadlines, repeats and your Logbook. Things isn't changed.",
    h1: "How to move from Things 3 to TodoCity",
    answer:
      "Open TodoCity's Settings → Import Data, click Find my Things library, check the preview and click Import. TodoCity reads a copy of Things 3's database on your Mac and brings your projects, headings, to-dos, checklists, dates, deadlines, repeats, tags and Logbook. Things itself isn't changed, so you can keep using it while you try TodoCity.",
    card: "The steps, staying in sync, and what each Things item becomes.",
    sections: [
      {
        h2: "Steps",
        blocks: [
          {
            steps: [
              { title: "Open Things 3 on this Mac", text: "Let it finish syncing. If you only use Things on iPhone or iPad, install Things 3 for Mac and sign in to Things Cloud first." },
              { title: "Find your library", text: "In TodoCity, open Settings → Import Data and click Find my Things library. If macOS asks whether TodoCity may access data from other apps, click Allow." },
              { title: "Check the preview", text: "Untick any project you'd rather leave behind, and choose whether to bring the Logbook and cancelled to-dos." },
              { title: "Keep in sync", text: "Leave it on and new to-dos and changes in Things keep flowing into TodoCity on their own. Your edits in TodoCity stay, and nothing is sent back to Things." },
              { title: "Click Import", text: "TodoCity backs itself up first (Settings → Backups & export → “before import”), so you can undo it." },
            ],
          },
          { p: "Stop syncing any time: for one project from its ⋯ menu, or for all of Things in Settings → Import Data. Its tasks stay in TodoCity." },
        ],
      },
      {
        h2: "What each Things item becomes",
        blocks: [
          {
            table: {
              caption: "Things 3 in TodoCity",
              head: ["Things 3", "TodoCity"],
              rows: [
                ["Project", "Project"],
                ["Heading", "Section"],
                ["To-do", "Task"],
                ["Checklist", "Sub-tasks"],
                ["Area", "Its projects come as they are; to-dos right in the area become a project named after it"],
                ["Inbox, loose to-dos", "Tasks with no project"],
                ["Today, This Evening, Upcoming", "The same day (and evening)"],
                ["Anytime / Someday", "No day / Someday"],
                ["Deadline, reminder time", "Deadline, time of day"],
                ["Tags", "#tags"],
                ["Logbook", "Done tasks: lit windows in your city"],
              ],
            },
          },
        ],
      },
      {
        h2: "Choosing your library yourself",
        blocks: [
          {
            p: "Click Choose the database myself…, then in Finder use Go → Go to Folder… with ~/Library/Group Containers/JLMPQHK86H.com.culturedcode.ThingsMac, open the ThingsData-… folder and pick Things Database.thingsdatabase. If macOS blocks it, give TodoCity Full Disk Access in System Settings → Privacy & Security, or copy that folder to your Desktop and choose the copy.",
          },
        ],
      },
    ],
    related: ["things-3-alternative", "move-from-todoist", "faq"],
  },
  {
    slug: "move-from-todoist",
    kind: "howto",
    title: "How to Move From Todoist to TodoCity (Step by Step)",
    description:
      "Import Todoist into TodoCity with an API token or CSV files: projects, sections, tasks, sub-tasks, labels, comments and completed tasks.",
    h1: "How to move from Todoist to TodoCity",
    answer:
      "Copy your API token in Todoist (Settings → Integrations → Developer), paste it in TodoCity's Settings → Import Data → Todoist, check the preview and click Import. TodoCity brings your projects, sections, tasks, sub-tasks, labels, comments and completed tasks straight to your Mac. The token is used only for the import and never saved.",
    card: "With an API token or CSV files, and what each Todoist item becomes.",
    sections: [
      {
        h2: "Steps",
        blocks: [
          {
            steps: [
              { title: "Copy your Todoist API token", text: "In Todoist (web or app), open Settings → Integrations → Developer and click Copy API token." },
              { title: "Connect", text: "In TodoCity, open Settings → Import Data → Todoist, paste the token and click Connect. Big accounts take a minute while completed tasks come in." },
              { title: "Check the preview", text: "Untick any project you'd rather leave behind, and choose whether to bring completed tasks." },
              { title: "Keep in sync", text: "Leave it on and Todoist changes keep flowing in every few minutes. Your token is kept in your Mac's Keychain, your edits in TodoCity stay, and nothing is sent back to Todoist." },
              { title: "Click Import", text: "TodoCity backs itself up first, so you can undo it. Running it again later brings only new tasks." },
            ],
          },
        ],
      },
      {
        h2: "No token? Use CSV files",
        blocks: [
          {
            p: "Export each project with ⋯ → Export as CSV in Todoist (or unzip a backup from Todoist's Settings → Backups), then choose No token? Use CSV files instead and pick all the .csv files. CSV exports carry your open tasks; connect with a token to bring completed ones and keep them in sync.",
          },
        ],
      },
    ],
    related: ["todoist-alternative", "move-from-things-3", "faq"],
  },
  {
    slug: "work-and-personal-tasks",
    kind: "guide",
    title: "Keep Work and Personal Tasks Apart on Mac (Modes) · TodoCity",
    description:
      "TodoCity's modes show only work projects on your work Mac and everything at home, in Today, the calendar, the menu bar and notifications.",
    h1: "How to keep work and personal tasks apart on a Mac",
    answer:
      "In TodoCity, pick a mode from the switch at the top of the sidebar. In Work, Today, the calendar, the menu bar and notifications show only your work projects; Personal shows everything. Each Mac remembers its own mode (Work on the work laptop, Personal at home) while the tasks stay the same on both.",
    card: "Work, Personal or your own modes, per Mac, with notifications that follow.",
    sections: [
      {
        h2: "Set up your modes",
        blocks: [
          {
            steps: [
              { title: "Open Settings → Modes", text: "Work and Personal are there already. Add your own (say, Study) with + New mode." },
              { title: "Tick the projects each mode shows", text: "Also choose whether tasks with no project show, whether new projects join automatically, and which calendars appear." },
              { title: "Choose where new tasks go", text: "In Work, tasks you capture with no project can go straight into a work project." },
              { title: "Switch", text: "Use the switch at the top of the sidebar, or ⌃⌥1, ⌃⌥2… (⌃⌥0 shows everything)." },
            ],
          },
        ],
      },
      {
        h2: "What a mode changes",
        blocks: [
          {
            list: [
              "Today, Calendar, Inbox and the menu bar show only the mode's projects; the rest is one mode switch away.",
              "Notifications can follow the mode, so personal reminders wait until you're home.",
              "Nothing is hidden for good and nothing moves: tasks stay the same on every Mac.",
            ],
          },
        ],
      },
      {
        h2: "Keep a project off your work Mac entirely",
        blocks: [
          {
            p: "If your Macs sync, you can also keep any project on one Mac only (Settings → Your other Macs → Keep on this Mac only): say, a personal project that should never be on your work laptop.",
          },
        ],
      },
    ],
    related: ["sync-macs-without-icloud", "private-todo-app-for-mac", "turn-text-into-tasks"],
  },
  {
    slug: "sync-macs-without-icloud",
    kind: "howto",
    title: "Sync Tasks Between Macs Without iCloud or an Account · TodoCity",
    description:
      "Pair your Macs with a code and six matching digits: TodoCity keeps tasks the same on both, end-to-end encrypted, with no iCloud or account.",
    h1: "How to sync tasks between Macs without iCloud",
    answer:
      "In TodoCity, open Settings → Your other Macs on both Macs. Show a code on one, type it on the other, and check that both show the same six digits. From then on your tasks stay the same on both, end-to-end encrypted, with no iCloud and no account. It works even on a work Mac that can't sign in to iCloud.",
    card: "Pairing in three steps, and how the encryption keeps the relay blind.",
    sections: [
      {
        h2: "Pair your Macs",
        blocks: [
          {
            steps: [
              { title: "Show a code", text: "On one Mac, choose Show a code. It shows a code like K7MX-4QRB for 10 minutes." },
              { title: "Type it on the other Mac", text: "Choose I have a code and type it in." },
              { title: "Compare six digits", text: "Both Macs show six digits. If they match, confirm on both. That's how you know nothing got between your Macs." },
            ],
          },
          { p: "Changes show up on the other Mac within about 30 seconds while both are open. A Mac that was asleep catches up within a minute of coming back. Add more Macs the same way." },
        ],
      },
      {
        h2: "How it stays private",
        blocks: [
          {
            list: [
              "Your Macs share a key made on your Mac, handed over only inside the pairing and kept in your Keychain.",
              "Every change is locked with it (ChaCha20-Poly1305) before it leaves your Mac.",
              "A small relay holds the sealed boxes until your other Macs pick them up, then deletes them, after 30 days at the latest. It never has the key, so it can't read titles, notes, projects or Mac names.",
              "There's no account behind it.",
            ],
          },
        ],
      },
      {
        h2: "Good to know",
        blocks: [
          {
            list: [
              "Edits on two Macs at once? Each detail keeps its newest edit, so renaming on one Mac and ticking off on the other both stick.",
              "Keep a project on one Mac only, if you like.",
              "Lost a Mac? Turn sync off on your other Macs and pair them again: that makes a new key the lost Mac doesn't have.",
            ],
          },
        ],
      },
    ],
    related: ["work-and-personal-tasks", "private-todo-app-for-mac", "faq"],
  },
  {
    slug: "gamified-todo-app",
    kind: "guide",
    title: "A Gamified To-Do App Without Streaks: Your City · TodoCity",
    description:
      "In TodoCity every project is a building and every finished task lights a window in your own 3D city. Milestones, no streaks, no penalties.",
    h1: "A to-do list that rewards you, without streaks or points",
    answer:
      "In TodoCity, every project is a building, its sections are floors and every task is a home. Finish a task and someone moves in: the lights come on, and stay on. As your population grows, your city gains street lamps, a park, a train, a harbour and more. There are no streaks to break, no points and no penalties.",
    card: "Buildings, floors, lit windows and milestones: rewards that never take anything away.",
    sections: [
      {
        h2: "How your city works",
        blocks: [
          {
            table: {
              caption: "Your tasks as a city",
              head: ["In your city", "In TodoCity"],
              rows: [
                ["An apartment building", "A project"],
                ["A floor", "A section of a project"],
                ["A home (dark window)", "A task to do"],
                ["The lights come on", "A finished task"],
                ["A faint glow", "Sub-tasks under way"],
                ["Blinking amber", "An overdue task"],
                ["Little houses at the edge of town", "Tasks in no project"],
                ["Population", "Every task you've finished"],
              ],
            },
          },
        ],
      },
      {
        h2: "Milestones",
        blocks: [
          {
            table: {
              caption: "What your city gains as it grows",
              head: ["Population", "Your city gains"],
              rows: [
                ["10", "Street lamps on every corner"],
                ["25", "A park"],
                ["50", "A fountain: the town square"],
                ["100", "A train line round the city"],
                ["250", "A harbour with a lighthouse and boats"],
                ["500", "A stadium with floodlights"],
                ["1,000", "A bridge to a second island"],
              ],
            },
          },
        ],
      },
      {
        h2: "The rules",
        blocks: [
          {
            list: [
              "What's built stays built: un-ticking or deleting a task never takes anything away.",
              "No streaks, points or penalties, and every feature is yours from day one.",
              "Prefer a clean screen? Make the city small, or hide it.",
            ],
          },
        ],
      },
    ],
    related: ["private-todo-app-for-mac", "things-3-alternative", "faq"],
  },
];

/** More questions, for the FAQ page (the home page shows the first few). */
export const MORE_FAQ: { q: string; a: string }[] = [
  {
    q: "Is TodoCity open source?",
    a: "Its source code is public on GitHub under the PolyForm Noncommercial license: free to read, build and use for personal, non-commercial purposes.",
  },
  {
    q: "Does TodoCity need an account?",
    a: "No. There's no sign-up, no email and no password. Your tasks live on your Mac.",
  },
  {
    q: "Does TodoCity work offline?",
    a: "Yes. After the one-time model download, everything works offline. Only sync between Macs and update checks use the internet.",
  },
  {
    q: "Is there an iPhone or iPad app?",
    a: "TodoCity is a Mac app. Turn on two-way Apple Reminders sync to see your tasks on iPhone through Reminders.",
  },
  {
    q: "Is there a Windows or web version?",
    a: "No. TodoCity is a native Mac app.",
  },
  {
    q: "How much disk space and memory does it need?",
    a: "The app itself is small; the AI model is a one-time download of about 2 GB. The model runs only while it reads a capture and stops after five idle minutes.",
  },
  {
    q: "Can it remind me at a specific time?",
    a: "Yes. Tasks with a time notify you with Done, Snooze and Tomorrow buttons. You can also choose one morning summary instead, and the menu-bar dropdown can open on a task when its time comes.",
  },
  {
    q: "Does TodoCity support repeating tasks?",
    a: "Yes: daily, weekdays, weekly, every two weeks, monthly, yearly and more, written in plain words like “every Monday”. Finish one and the next is scheduled; skip one or pause the series any time.",
  },
  {
    q: "Can I see my calendar next to my tasks?",
    a: "Yes, both ways. Turn on the Apple Calendar connector to show your meetings (including Google, Outlook and iCloud calendars added to your Mac) beside your tasks. Turn on Put my tasks in Calendar and tasks with a day and time become events, in calendars of their own: one per project, grouped like TodoCity · Work · Launch, never your default calendar. Move or stretch an event and the task follows.",
  },
  {
    q: "Can AI assistants add tasks to TodoCity?",
    a: "Yes. Claude Code, Claude Desktop, Cursor, VS Code, Windsurf and LM Studio can add tasks over MCP, on your Mac only, and you approve each one. Turn on Full access and they can read, change, schedule and complete your tasks too.",
  },
  {
    q: "Can TodoCity run an AI agent in the background?",
    a: "Yes. Turn on Email to tasks and TodoCity runs Claude Code on a schedule to find the to-dos in your new email and send them for review. TodoCity itself never reads your mail.",
  },
  {
    q: "How do I keep work and personal tasks separate?",
    a: "Use modes: Work shows only the projects you tick, Personal shows everything. Each Mac remembers its own mode.",
  },
  {
    q: "Can I export my tasks?",
    a: "Yes, to CSV or JSON from Settings → Backups & export. TodoCity also keeps seven days of automatic backups.",
  },
  {
    q: "How do I install TodoCity?",
    a: "Download the .dmg, drag TodoCity to Applications and open it. It's signed and notarized by Apple, so it opens like any other Mac app, and it updates itself from then on.",
  },
  {
    q: "Can I see my tasks as a board?",
    a: "Yes. Inbox and every project have a List / Board switch: Inbox's board has columns for Today, Tomorrow, Next 7 days, Later and Someday, and a project's board has a column for each section. Drag a card to move it.",
  },
  {
    q: "How does TodoCity update?",
    a: "It checks GitHub for new versions when it opens and every day at 12:00 PM. The version in the footer turns red when one is ready, and Update restarts into it. You can turn update checks off.",
  },
];

export const bySlug = (slug: string) => PAGES.find((p) => p.slug === slug);
