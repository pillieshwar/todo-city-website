---
title: Todoist
description: Bring your Todoist into TodoCity and keep the two in sync, both ways by default. Edit, add, finish or delete in either app and the other follows.
section: connectors
order: 2
---

**Settings → Connectors → Todoist** brings your Todoist into TodoCity and keeps the two in sync, both ways. Keep using Todoist on your phone or with your team, and TodoCity on your Mac.

![The Todoist card in Settings → Connectors: Syncing with Todoist, synced 1 min ago, with Two-way sync on](/docs/img/todoist-two-way.webp "Todoist, syncing both ways.")

## Connect with your API token

:::steps
1. **Copy your API token from Todoist.** In Todoist (web or app), open **Settings → Integrations → Developer** and click **Copy API token**.
2. **Paste it in TodoCity** and click **Connect**. TodoCity reads your projects, sections, tasks, sub-tasks, labels, comments and completed tasks straight from Todoist's servers to your Mac. Big accounts take a minute while completed tasks come in, year by year.
3. **Check the preview.** Untick any project you'd rather leave behind, and choose whether to **Bring completed tasks**.
4. **Keep in sync** (on unless you turn it off). TodoCity and Todoist stay in step every few minutes, both ways.
5. **Click Import.** TodoCity backs itself up first, in **Settings → Backups & export**, marked **before import**.
:::

Running it again later brings only tasks that are new since last time.

With **Keep in sync** on, your token is kept in the macOS Keychain, and deleted when you stop syncing. With it off, the token is used once and forgotten.

## No token? Use CSV files

:::steps
1. **Export each project from Todoist** with **⋯ → Export as CSV**. On Todoist Pro you can instead download a backup from **Settings → Backups** and unzip it.
2. **In TodoCity, choose No token? Use CSV files instead.**
3. **Click Choose CSV files…** and pick all the .csv files together.
:::

CSV files carry your open tasks. To bring completed tasks too, connect with a token.

## Two-way sync

With **Two-way sync** on (the way it starts), you edit in either app and the change shows up in the other: change a task, add one to a synced project, finish it or delete it.

### What goes back to Todoist

When you change a synced task in TodoCity, these go back to Todoist:

- title
- notes
- day and time
- repeat
- deadline
- priority
- project and section
- done
- deleted

These stay as they are in Todoist: **sub-tasks**, **Someday** and **This Evening**.

### When both apps change the same thing

Each detail is compared on its own. When the same detail changed in both apps since the last sync, **Todoist's change is kept**. Different details changed in each app both stick.

### What stays on your Mac

- New tasks in your TodoCity **Inbox** stay in TodoCity.
- New tasks in projects that started in TodoCity stay in TodoCity.
- Projects you keep under **Keep on this Mac only** (in **Settings → Your other Macs**) send nothing.

New tasks you add to a project that syncs with Todoist go to Todoist too. Moving a synced task into a project that doesn't sync stops syncing that task; Todoist keeps its copy.

### Prefer one-way?

Turn off **Two-way sync** in Todoist's card. Then Todoist's changes keep coming in, and your edits in TodoCity stay in TodoCity. Synced tasks stay editable either way.

## Stop syncing

- **One project:** open its **⋯** menu in the sidebar and choose **Stop syncing**. Its tasks stay in TodoCity.
- **All of Todoist:** click **Stop syncing** in Todoist's card in **Settings → Connectors**.

Your tasks stay in both apps either way. **Sync now** in the card syncs straight away.

## The safety brake on deletes

If one sync would delete more than 20 tasks, and that's also more than half of the tasks linked between the two apps, TodoCity holds the whole batch back and deletes nothing in that sync. This works in both directions, so a slip in either app can't empty the other.

A task you delete in TodoCity stays deleted: it never comes back from Todoist.

## Two Macs

Both your Macs can keep Todoist in sync. Some changes can't safely happen twice, like adding a task or finishing a repeating one. When one of those arrives from your other Mac, this Mac waits 10 minutes so the Mac that made the change sends it to Todoist first. Edits and deletes go straight away.

A new task TodoCity sends to Todoist carries a short `todocity://task/…` line in its description. That's how your other Mac recognizes the task and links to it instead of adding it twice.

Repeating tasks move on once in both apps, even with two Macs.

## What goes where

| Todoist | TodoCity |
| --- | --- |
| Project (and sub-projects) | Project |
| Inbox | Tasks with no project |
| Section | Section |
| Task | Task |
| Sub-tasks, any depth | Sub-tasks |
| Labels | `#tags` on the task |
| Priority 1–3 | Priority P1–P3 |
| Description and comments | Notes |
| Date and time, deadline | Day and time, deadline |
| Recurring date | The same repeat when it's daily, weekdays, weekly, every 2 weeks, monthly or yearly. Custom repeats come once, with a note so you can pick a repeat |
| Completed tasks | Done tasks (with a token) |

Deleted tasks stay behind. Archived projects come only for their completed tasks.

> [!PRIVATE]
> With **Keep in sync** on, TodoCity reads your Todoist with your token and, with two-way sync, sends changes to synced tasks back to Todoist's servers. Tasks in your TodoCity Inbox, in projects that don't sync with Todoist and in **Keep on this Mac only** projects stay on your Mac.

For help with the token, see [Troubleshooting](/docs/troubleshooting#connect-todoist-with-a-token).
