---
title: AI agents
description: Connect Claude Code, Codex, Cursor, Claude Desktop, VS Code and more over MCP. Agents add tasks for your approval, or run your list with Full access.
section: agents
order: 1
---

AI apps on your Mac, like Claude Code, Codex and Cursor, can work with your tasks through TodoCity's built-in MCP server. To begin with, all they can do is add tasks, and you approve each one. If you turn on **Full access**, they can also plan and tidy your list for you. Every change they make is marked, and easy to undo.

## Connect your AI apps

![Settings → Agents: Agents can add tasks, and Your agents with Claude Code, Codex, Claude Desktop and Cursor, each with Connect](/docs/img/settings-agents.webp "Settings → Agents.")

:::steps
1. **Open Settings → Agents** and turn on **Agents can add tasks**. It's a single switch, and it only applies to this Mac.
2. **Find your agents.** Every agent on your Mac shows up as a card under **Your agents**, including ones installed with nvm, asdf or mise. If you've just installed one, click **Check for agents**.
3. **Click Connect** on a card. TodoCity adds its MCP server to that agent's settings and opens the agent in the [agent panel](/docs/agents/panel), where it checks it can see TodoCity. You can type to it there if it needs a hand.
4. **Ask your agent** something like “add a TodoCity task to send the deck Friday 3pm”.
:::

## Your default agent

Pick a **Default agent** at the top of **Your agents**. TodoCity uses it whenever you haven't picked another: for [Slack](/docs/connectors/slack), for new sessions in the agent panel, and as the first choice in **Send to agent**. For Slack, an agent that already has Slack comes first, so if Claude Code has Slack and Codex doesn't, Slack uses Claude Code.

## Add your own agent

Using an agent TodoCity doesn't know? Click **Add agent…** and pick its program, for example in `~/.local/bin` or `/opt/homebrew/bin`. It gets a card, shows up in the agent panel and in **Send to agent**, and **Set up** starts it in the panel and asks it to add TodoCity to its own settings while you watch.

These apps connect in one click:

- Claude Code
- Codex
- Claude Desktop
- Cursor
- VS Code
- Windsurf
- Antigravity CLI
- Gemini CLI
- LM Studio

**Using a different app that isn't a command-line agent?** Open **More: another app, or test the connection**, and add a stdio MCP server named “todocity” using the command shown there. **Copy JSON** and **Copy command** give it to you ready to paste, and **Test the connection** makes sure everything works.

> [!NOTE]
> Connecting only works when TodoCity is opened from **Applications**. Agents you start from TodoCity's own [agent panel](/docs/agents/panel) are connected for you.

## Add-only, with your approval

Out of the box, agents can only **add** tasks. Each task an agent sends waits in the menu bar until you add it, just like a capture.

With **Suggest tasks on their own** turned on, agents can send you a task without being asked, for example when you mention a deadline or say “remind me”. You still approve each one.

## Full access

When you turn on **Full access** in **Settings → Agents**, agents can read, add, change, schedule, complete and delete your tasks, sub-tasks, reminders, projects and sections. Settings tells you how many tools that gives them.

With Full access, your agent can handle requests like these. Many apps offer them ready-made, as slash commands:

| Request | What the agent does |
| --- | --- |
| **Plan my day** | Finds the free time between your meetings, fits today's tasks into it and shows you the plan. Once you say yes, it schedules them |
| **Weekly review** | Sums up what you got done, what slipped and what to move to next week, and checks with you before changing anything |
| **Tidy my Inbox** | Suggests a project and section for each task in your Inbox, and checks with you before moving anything |

## See and undo what agents did

Anything an agent adds or changes is marked on the task with the agent's icon, such as **Scheduled by Claude** or **Added by Claude**, and each mark comes with **Undo**.

![Today showing only what agents changed, with a banner Agents added or changed 3 tasks here, by Claude, and Undo all](/docs/img/changed-by-agents.webp "Changed by agents, with Undo on each task and for the whole request.")

- **To see it all**, click the **View** button at the top and pick **Changed by agents**. You'll also find **Only mine** and **Everything** there.
- **Undo one task** at a time, or use **Undo all** to roll back everything from one request.
- **To bring back deleted tasks**, look under **Deleted by agents** in **Settings → Agents**. Tasks an agent deleted stay there for 7 days, each with **Bring back**.
- The menu bar also shows what an agent just did, with **Undo**.

Once you change a task yourself, its agent mark goes away.

> [!PRIVATE]
> Agents talk to TodoCity over a local connection on your Mac. Whatever an agent reads, it sends on to its own AI service. With add-only access, agents can only add tasks for you to review. With **Full access**, they can read and change your tasks too.

## More with agents

:::cards
- [The agent panel](/docs/agents/panel) Run agents inside TodoCity and hand tasks over to them.
- [Watch](/docs/watch) Spot to-dos on your screen, using an agent or the model on your Mac.
- [Email to tasks](/docs/email-to-tasks) Turn emails into tasks.
:::
