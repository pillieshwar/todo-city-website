---
title: Privacy
description: Private by default. Your tasks and everything you capture stay on your Mac; features that send data somewhere are off until you turn them on.
section: privacy
order: 1
---

> [!PRIVATE]
> Nothing leaves your Mac unless you turn it on.

Out of the box, your tasks and everything you capture stay on your Mac. A few features do send data to a service you choose, but each of them is off until you turn it on, and each one tells you where your data goes.

## Stays on your Mac

| What | How |
| --- | --- |
| **Capture** | The text you select is read through macOS Accessibility and handed to the open model running on `127.0.0.1`, with a random port and key for every session |
| **Your tasks** | Stored in `~/Library/Application Support/TodoCity/` (**Settings → Backups & export → Show data folder**), with seven days of backups in `backups/` |
| **No accounts, analytics or telemetry** | Even notifications are scheduled by your Mac rather than a server |

## Leaves your Mac only when you turn it on

| Feature | Where the data goes |
| --- | --- |
| **Agents** (**Settings → Agents**) | Connected agents like Claude Code, Codex and Cursor can add tasks for you to review or, with **Full access**, read and change them. They talk to TodoCity over a local connection, and whatever an agent reads, it sends to its AI service. Agents started from the agent panel connect with the access you've chosen, and any task you send to an agent goes to it and then to its AI service |
| **Watch** (**Settings → Watch**) | Reads the text of the window in front of you and keeps none of it. It never reads password managers, Keychain, System Settings or terminals, and never reads what you type. New lines that look like to-dos go to whichever reader you pick: an agent you've connected, which sends them to its AI service, or the open model on your Mac |
| **Sync between your Macs** | End-to-end encrypted. Changes pass through a relay as sealed boxes that it can't open, and the key exists only in the Keychain on your Macs. The relay keeps no logs, has no accounts, and deletes each box once every Mac has it (after 30 days at most) |
| **Slack** (**Settings → Connectors**) | The agent you pick reads Slack with its own Slack access and sends what it reads to its AI service, as when you use it yourself. Claude Code runs with only its Slack read and search tools allowed. TodoCity never signs in to Slack, and the tasks it adds stay on your Mac |
| **Todoist** (**Settings → Connectors**) | With keep-in-sync on, TodoCity reads your Todoist using your token. With two-way sync, it also sends changes to synced tasks back to Todoist's servers. New tasks in your TodoCity Inbox, in projects that don't sync with Todoist and in “Keep on this Mac only” projects stay on your Mac |
| **Apple Reminders and Calendar** | Sync through iCloud if you pick an iCloud list or account. Pick “On My Mac” to keep them local. “Keep on this Mac only” projects never go to Calendar |
| **Model downloads** | Any model you download comes from Hugging Face and is checked against its SHA-256 |
| **Update checks** | Go to GitHub. You can turn them off with **Update automatically** in **Settings → General** |

## Feature by feature

:::cards
- [AI models](/docs/ai-models) Downloaded from Hugging Face, then run offline on your Mac.
- [Sync between your Macs](/docs/sync-between-macs) How the key and the relay work.
- [Slack](/docs/connectors/slack) Your own agent reads Slack, with only its read tools.
- [Todoist](/docs/connectors/todoist) What goes back to Todoist, and what stays here.
- [Apple Reminders](/docs/connectors/apple-reminders) iCloud lists versus On My Mac lists.
- [Apple Calendar](/docs/connectors/apple-calendar) Your meetings, and your tasks in Calendar.
- [AI agents](/docs/agents) Add-only to begin with, and Full access if you turn it on.
- [Watch](/docs/watch) What it reads, and who gets to read it.
- [Your city](/docs/city) A shared picture never includes task names, notes or times.
:::

## Captured text is only data

TodoCity treats selected text as untrusted input. It's wrapped and sanitized as data, the only instructions the model follows live in its system prompt, and a strict schema means the most any text can do is suggest a task, which you then review.

## Open source

TodoCity is free and open source under the MIT License, so anyone can check exactly what it does. The code, including the sync relay, is on [GitHub](https://github.com/pillieshwar/TodoCity). If you find a security issue and want to report it privately, see the [security policy](https://github.com/pillieshwar/TodoCity/security/policy).
