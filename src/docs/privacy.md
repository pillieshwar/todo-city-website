---
title: Privacy
description: Private by default. Your tasks and everything you capture stay on your Mac; features that send data somewhere are off until you turn them on.
section: privacy
order: 1
---

> [!PRIVATE]
> Nothing leaves your Mac unless you turn it on.

Out of the box, your tasks and everything you capture stay on your Mac. Some features send data off your Mac to a service you choose. Each one is off until you turn it on, and says where the data goes.

## Stays on your Mac

| What | How |
| --- | --- |
| **Capture** | Text you select is read through macOS Accessibility and handed to the open model running on `127.0.0.1`, with a random port and key for each session |
| **Your tasks** | Stored in `~/Library/Application Support/TodoCity/` (**Settings → Backups & export → Show data folder**), with seven days of backups in `backups/` |
| **No accounts, analytics or telemetry** | Notifications are scheduled by your Mac, not a server |

## Leaves your Mac only when you turn it on

| Feature | Where the data goes |
| --- | --- |
| **Agents** (**Settings → Agents**) | Connected agents like Claude Code, Codex and Cursor add tasks for your review, or, with **Full access**, read and change them. They talk to TodoCity over a local connection; what an agent reads, it sends to its AI service. Starting an agent from the agent panel connects it with the access you've chosen, and a task you send to an agent goes to it and on to its AI service |
| **Watch** (**Settings → Watch**) | Reads the text of the window in front (never password managers, Keychain, System Settings or terminals, and never what you type) and keeps none of it. New lines that look like to-dos go to the reader you pick: an agent you've connected, which sends them to its AI service, or the open model on your Mac |
| **Sync between your Macs** | End-to-end encrypted. Changes pass through a relay as sealed boxes it can't open; the key exists only on your Macs, in the Keychain. The relay keeps no logs, deletes each box once every Mac has it (30 days at most), and has no accounts |
| **Todoist** (**Settings → Connectors**) | With keep-in-sync on, TodoCity reads your Todoist with your token and, with two-way sync, sends changes to synced tasks back to Todoist's servers. New tasks in your TodoCity Inbox, in projects that don't sync with Todoist and in “Keep on this Mac only” projects stay on your Mac |
| **Apple Reminders and Calendar** | Sync through iCloud if you pick an iCloud list or account. Pick “On My Mac” to keep them local. “Keep on this Mac only” projects never go to Calendar |
| **Model downloads** | Models you download come from Hugging Face and are checked against their SHA-256 |
| **Update checks** | Go to GitHub. Turn them off with **Update automatically** in **Settings → General** |

## Feature by feature

:::cards
- [AI models](/docs/ai-models) Downloads from Hugging Face, then runs offline on your Mac.
- [Sync between your Macs](/docs/sync-between-macs) How the key and the relay work.
- [Todoist](/docs/connectors/todoist) What goes back to Todoist, and what stays here.
- [Apple Reminders](/docs/connectors/apple-reminders) iCloud lists and On My Mac lists.
- [Apple Calendar](/docs/connectors/apple-calendar) Your meetings, and your tasks in Calendar.
- [AI agents](/docs/agents) Add-only by default; Full access when you turn it on.
- [Watch](/docs/watch) What it reads, and who reads it.
- [Your city](/docs/city) A shared picture holds no task names, notes or times.
:::

## Captured text is only data

Selected text is treated as untrusted input: it's wrapped and sanitized as data, instructions live only in the model's system prompt, and a strict schema means the most any text can do is suggest a task, which you review.

## Open source

TodoCity is free and open source under the MIT License, so anyone can read exactly what it does. The code is on [GitHub](https://github.com/pillieshwar/TodoCity), including the sync relay. To report a security issue privately, see the [security policy](https://github.com/pillieshwar/TodoCity/security/policy).
