---
title: Slack
description: Turn on Slack in Settings → Connectors, and Slack messages that need you show up as tasks in your Inbox. Your own agent does the reading.
section: connectors
order: 6
---

**Settings → Connectors → Slack** turns Slack messages that need you into tasks in your Inbox: a direct message asking you for something, a group DM waiting on your answer, a mention in a thread. It takes one switch.

TodoCity doesn't sign in to Slack itself. The agent you already use reads it for you, with the Slack connection that agent already has:

| Agent | Where its Slack connection comes from |
| --- | --- |
| **Claude Code** | Slack's MCP server, or Slack connected under Connectors on claude.ai |
| **Codex** | A Slack MCP server in `~/.codex/config.toml` |
| **Cursor Agent** | A Slack MCP server in Cursor → Settings → MCP |

## Turn it on

:::steps
1. **Open Settings → Connectors** and turn on the **Slack** switch.
2. **Watch it check.** TodoCity opens your agent in the agent panel beside your tasks. The agent finds its Slack tools and reads your latest direct message. If it asks to use Slack, allow it.
3. **That's it.** TodoCity tells you when Slack is connected, and your latest DM is already in your Inbox so you can see how it looks.
:::

If your agent doesn't have Slack yet, TodoCity shows the steps for that agent, with **Ask the agent to help** and **Check again**.

## How it works

- **Every 5 minutes**, your agent looks at your DMs, group DMs and mentions since the last check.
- **Nothing is missed.** If your Mac was asleep, TodoCity picks up from where the last check ended, as soon as it wakes.
- **Only what needs you.** Requests to do, answer, decide, review, approve or send something become tasks. Chat, thanks, bots and messages you already answered don't.
- **One task per message.** Each Slack message becomes one task at most, with a link back to the conversation, even after you delete or finish the task.
- **Check now** on the card looks straight away, and the card lists what came in from Slack.
- **Change the agent** from the picker on the card.

> [!PRIVATE]
> Your agent reads Slack with its own Slack access and sends what it reads to its AI service, just as when you use it yourself. Claude Code runs with only its Slack read and search tools allowed, so it can't send, react or change anything. TodoCity holds no Slack sign-in, and the tasks stay on your Mac.

## Slack Secretary

Once Slack is connected, TodoCity asks whether to turn on **Slack Secretary**. You can also switch it on later in the Slack card.

A background task on your Mac runs it, whether TodoCity is open or not. macOS lists it under **System Settings → General → Login Items**. If your Mac was off or asleep, the next run catches up on those hours (up to a week back), so nothing is missed.

### Its routine

Slack Secretary follows a routine you set, step by step, under **Routine** in the Slack card. Changes save as you make them, and the next run follows them.

:::steps
1. **Run** every 5 minutes (the default), or every 10, 15 or 30 minutes, or every hour.
2. **Read** what you tick: **Direct messages** and **Group DMs** are on to start, and **Mentions of you in any channel** is off. **Channels** are read only when you pick them: click **Choose channels…**, and your agent lists the channels you're in so you can tick the ones you want.
3. **Make a task** for each message that asks you to do, answer, decide, review, approve or send something, with a priority (**urgent**, **high** or **medium**) if you leave that on. A message that needs an answer today is at least high.
4. **Follow your own rules**, written in plain words, like "anything from Maya is urgent" or "skip messages about lunch".
5. **Add them to your Inbox**, one task per message, with where it came from, like "#launch" or "DM with Sam".
:::

**See the exact instructions** shows what each run asks your agent, word for word. Your rules never change what the agent may do: it only reads Slack.

What it finds shows up in your Inbox within seconds while TodoCity is open, or the next time you open it. A notification tells you either way.

## Turn it off

Turn off the switch (turning off Slack stops Slack Secretary too). The tasks already in your Inbox stay, and turning it back on later never adds the same message twice.
