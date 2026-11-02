---
title: Email to tasks
description: Turn emails into tasks. Capture an email with ⌘C twice, let Watch spot requests in Mail, or ask an agent like Claude Code to add them.
section: agents
order: 4
---

You can turn emails into tasks in three ways, from handling one email at a time to working through your whole inbox.

## Capture an email

Select the part of the email that asks you to do something, and press <kbd>⌘C</kbd> twice. TodoCity writes the task and its date, and the task gets a **from Mail** chip that takes you back to the email in one click. See [Capture](/docs/capture).

<!-- TODO screenshot: a capture card made from an email in Mail ("From Mail · New task"). No ui-previews shot shows one yet. -->

## Let Watch spot them

When [Watch](/docs/watch) is on, TodoCity reads the email you're looking at and suggests any requests, deadlines and promises it finds as tasks for you to approve. Watch now does everything the earlier **Email to tasks** feature did, and it works with every app on your screen.

## Ask an agent, like Claude Code

If you use an agent that can read your email, connect it to TodoCity and ask it to add the tasks for you:

:::steps
1. **Connect the agent** in **Settings → Agents**. See [AI agents](/docs/agents).
2. **Ask it** in your own words, for example: “go through today's emails and add a TodoCity task for each thing I need to do, with its due date”.
3. **Approve the tasks.** Each one waits in the menu bar until you add it.
:::

You can also start Claude Code from TodoCity's [agent panel](/docs/agents/panel), where it's connected already.

> [!PRIVATE]
> Capture, and Watch with the open model, stay on your Mac. An agent, on the other hand, reads your email with its own access and sends what it reads to its AI service. TodoCity only receives the tasks it adds.
