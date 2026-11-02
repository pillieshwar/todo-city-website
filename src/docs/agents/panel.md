---
title: The agent panel
nav: Agent panel
description: Run Claude Code, Codex and other agents right beside your list, hand any task to an agent, and review its work before you mark it done.
section: agents
order: 2
---

The agent panel runs AI agents inside TodoCity, right beside your list. Each one starts with TodoCity's MCP server already connected, so you can ask it to plan your day, tidy your Inbox or work on a task.

![Full screen with the agent panel open on the right: Claude Code working on a task in a terminal, beside Today](/docs/img/agent-panel.webp "The agent panel, beside your list.")

## Open the panel

In full screen, click the terminal button at the top right. Then start an agent:

- Claude Code
- Codex
- Antigravity CLI
- Gemini CLI
- Cursor Agent
- or a plain **Terminal**

The panel offers the agents installed on your Mac. Each session starts in a folder you choose: click the folder button to change it. Open sessions stay listed so you can switch between them.

## Send a task to an agent

:::steps
1. **Point at a task** and click the agent button on the right of its line, or choose **Send to agent…** in its **⋯** menu.
2. **Pick the agent** and the folder to **Work in**. Add anything else it should know under **Anything to add?**
3. **Click Send to agent**, or press <kbd>Return</kbd>.
:::

The agent gets the task's title, notes and sub-tasks, works in the folder you chose, and tells TodoCity how it's going.

## Follow along

The task shows where the agent is:

| State | What it means |
| --- | --- |
| Working | The agent is on it |
| Needs you | The agent has a question. Click **Answer** |
| Ready to review | The agent has finished and reported back, with its summary and any links |

When it's ready, look over the work, then click **Mark done**. To ask for changes, use **Send back with a note**.

- **What it did** shows everything the agent's terminal showed, even after you quit TodoCity. It's kept on your Mac.
- When an agent finishes without a summary, the task shows the last lines from its terminal.

## With agents

**With agents** in the sidebar lists every task you've handed off, grouped by what needs you, what's ready to review and what's still going. It appears once you've sent a task to an agent.

![With agents in the sidebar: tasks grouped into Needs you, Ready to review and Working](/docs/img/with-agents.webp "With agents: everything you've handed off.")

> [!PRIVATE]
> An agent you start from the panel connects with the access you've chosen in **Settings → Agents**. A task you send to an agent goes to it, and on to its AI service.
