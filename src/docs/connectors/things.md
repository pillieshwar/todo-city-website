---
title: Things 3
description: Bring your whole Things 3 library into TodoCity on your Mac, and keep new to-dos and changes in Things flowing in.
section: connectors
order: 3
---

**Settings → Connectors → Things 3** brings your whole Things 3 library into TodoCity. It all happens on your Mac: TodoCity reads a copy of Things' database, and Things itself isn't changed, so you can keep using it while you try TodoCity.

## Move in

:::steps
1. **Open Things 3 on this Mac** and let it finish syncing, so this Mac has all your to-dos. Use Things only on iPhone or iPad? Install Things 3 for Mac and sign in to Things Cloud first.
2. **In TodoCity, click Find my Things library** in **Settings → Connectors → Things 3**. If macOS asks whether TodoCity may access data from other apps, click **Allow**.
3. **Check the preview.** Untick any project you'd rather leave behind, and choose whether to **Bring the Logbook** and **Bring cancelled to-dos**.
4. **Keep in sync** (optional). Leave it on, and new to-dos and changes in Things keep flowing into TodoCity on their own.
5. **Click Import.** TodoCity backs itself up first, in **Settings → Backups & export**, marked **before import**, so you can undo it.
:::

Running it again later brings only to-dos that are new since last time, even if you've deleted some in TodoCity.

## Keep in sync

With **Keep in sync** on, new to-dos and changes in Things come into TodoCity on their own. Your edits in TodoCity stay in TodoCity, and synced tasks stay editable.

- **Stop syncing one project** from its **⋯** menu in the sidebar. Its tasks stay in TodoCity.
- **Stop syncing all of Things** with **Stop syncing** in its card in **Settings → Connectors**.
- **Sync now** in the card brings changes in straight away.

## What goes where

![The Things 3 card with its What goes where table open, from Project to Logbook](/docs/img/things-what-goes-where.webp "The (i) next to What goes where shows this table in the app.")

| Things 3 | TodoCity |
| --- | --- |
| Project | Project |
| Heading | Section |
| To-do | Task |
| Checklist | Sub-tasks |
| Area | Its projects come as they are; to-dos right in the area become a project named after it |
| Inbox and loose to-dos | Tasks with no project |
| Today, This Evening, Upcoming | The same day (and evening). Today items from earlier days come in for today |
| Anytime | No day |
| Someday | Someday |
| Deadline | Deadline |
| Reminder time | Time of day |
| Repeating to-do | The same repeat when it's daily, weekdays, weekly, every 2 weeks, monthly or yearly. Other patterns come once, with a note so you can pick a repeat |
| Notes | Notes |
| Tags | `#tags` on the task |
| Logbook | Done tasks |

Trashed to-dos stay behind. Projects you've finished come with their to-dos as done.

## Find your library yourself

If **Find my Things library** doesn't find it, click **Choose the database myself…**:

:::steps
1. **In Finder, choose Go → Go to Folder…** and paste `~/Library/Group Containers/JLMPQHK86H.com.culturedcode.ThingsMac`
2. **Open the `ThingsData-…` folder.**
3. **Pick `Things Database.thingsdatabase`.**
:::

If macOS asks for permission, give TodoCity **Full Disk Access** in **System Settings → Privacy & Security**. Or copy that folder to your Desktop first and choose the copy.

> [!PRIVATE]
> Moving in from Things happens entirely on your Mac. TodoCity reads a copy of the database, and nothing is sent anywhere.
