---
title: AI agents
description: Connect Claude Code, Codex, Cursor, Claude Desktop, VS Code and more over MCP. Agents add tasks for your approval, or run your list with Full access.
section: agents
order: 1
---

AI apps on your Mac, like Claude Code, Codex and Cursor, can work with your tasks through TodoCity's built-in MCP server. By default they can only add tasks, and you approve each one. Turn on **Full access** and they can plan and tidy your list for you, with every change marked and easy to undo.

## Connect your AI apps

![Settings → Agents: Agents can add tasks, and Your agents with Claude Code, Codex, Claude Desktop and Cursor, each with Connect](/docs/img/settings-agents.webp "Settings → Agents.")

:::steps
1. **Open Settings → Agents** and turn on **Agents can add tasks**. It's one switch, for this Mac only.
2. **Click Connect** next to each app under **Your agents**, or **Connect all**. Connect adds TodoCity's MCP server to that app's settings.
3. **Ask your agent**: “add a TodoCity task to send the deck Friday 3pm”.
:::

TodoCity connects in one click to:

- Claude Code
- Codex
- Claude Desktop
- Cursor
- VS Code
- Windsurf
- Antigravity CLI
- Gemini CLI
- LM Studio

**Another app?** Open **More: another app, or test the connection**. Add a stdio MCP server named “todocity” with the command shown there: **Copy JSON** or **Copy command** has it ready. **Test the connection** checks it works.

> [!NOTE]
> Connecting works when TodoCity is opened from **Applications**. Agents you start from TodoCity's own [agent panel](/docs/agents/panel) are connected for you.

## Add-only, with your approval

Out of the box, agents can only **add** tasks. Each task an agent sends waits in the menu bar until you add it, the same way a capture does.

**Suggest tasks on their own** lets agents send a task when you mention a deadline or say “remind me”, without being asked. You still approve each one.

## Full access

Turn on **Full access** in **Settings → Agents**, and agents can read, add, change, schedule, complete and delete tasks, sub-tasks, reminders, projects and sections. Settings shows how many tools that gives them.

With Full access, your agent can do things like these, offered as ready-made requests (slash commands in many apps):

| Request | What the agent does |
| --- | --- |
| **Plan my day** | Finds the free time between your meetings, fits today's tasks into it and shows you the plan. It schedules them once you say yes |
| **Weekly review** | Sums up what you got done, what slipped and what to move next week, and asks before changing anything |
| **Tidy my Inbox** | Suggests a project and section for each task in your Inbox, and asks before moving anything |

## See and undo what agents did

Everything an agent adds or changes is marked on the task with the agent's icon, like **Scheduled by Claude** or **Added by Claude**, each with **Undo**.

![Today showing only what agents changed, with a banner Agents added or changed 3 tasks here, by Claude, and Undo all](/docs/img/changed-by-agents.webp "Changed by agents, with Undo on each task and for the whole request.")

- **See it all:** click the **View** button at the top and pick **Changed by agents**. **Only mine** and **Everything** are there too.
- **Undo one task**, or **Undo all** for everything from one request.
- **Bring back deleted tasks:** tasks an agent deleted are listed under **Deleted by agents** in **Settings → Agents** for 7 days, each with **Bring back**.
- The menu bar shows what an agent just did, with **Undo**.

When you change a task yourself, its agent mark goes away.

> [!PRIVATE]
> Agents talk to TodoCity over a local connection on your Mac. What an agent reads, it sends to its own AI service. With add-only access, agents add tasks for your review; with **Full access**, they can read and change your tasks.

## More with agents

:::cards
- [The agent panel](/docs/agents/panel) Run agents inside TodoCity and hand them tasks.
- [Watch](/docs/watch) Spot to-dos on your screen, read by an agent or the model on your Mac.
- [Email to tasks](/docs/email-to-tasks) Turn emails into tasks.
:::
