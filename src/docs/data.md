---
title: Your data
description: Your tasks live in one file on your Mac. TodoCity keeps a backup for each of the last 7 days, and exports to CSV or JSON whenever you like.
section: privacy
order: 2
---

Your tasks live in a single SQLite file on your Mac, in a folder TodoCity keeps for itself. You don't need an account, and you can back up, export or restore it from **Settings → Backups & export**.

![Settings → Backups & export: Export CSV, Export JSON and Back up now, with two daily backups listed, each with Restore](/docs/img/settings-backups.webp "Settings → Backups & export.")

## The data folder

Everything TodoCity keeps on this Mac is in one folder: your tasks, backups, AI models and settings.

```text
~/Library/Application Support/TodoCity/
```

Click **Show data folder** in **Settings → Backups & export** to open it in Finder.

## Daily backups

TodoCity keeps a backup for each of the last 7 days, in the `backups/` folder inside the data folder. It also backs up:

| Backup | When |
| --- | --- |
| **before import** | Just before you bring in tasks from Todoist or Things 3 |
| **before restore** | Just before you restore a backup |
| **manual** | When you click **Back up now** |

**Show backups folder** opens them in Finder.

## Export

- **Export CSV** saves your tasks as a CSV file in Downloads, ready for a spreadsheet.
- **Export JSON** saves them as JSON in Downloads.

## Restore a backup

:::steps
1. **Open Settings → Backups & export.**
2. **Click Restore…** next to the backup you want.
3. **Click Restore** when TodoCity asks **Replace your tasks?**
:::

Your tasks from just before are backed up first, as **before restore**, so a restore can be undone too.

## More than one Mac

To keep the same tasks on more than one Mac, pair them with [Sync between your Macs](/docs/sync-between-macs).

## Delete everything

To delete your tasks and models from this Mac, quit TodoCity and remove its data folder:

```bash
rm -rf ~/Library/Application\ Support/TodoCity ~/Library/Application\ Support/app.pluck.desktop
```

If you use sync, turn it off first in **Settings → Your other Macs**, or delete the “app.todocity.sync” item in Keychain Access afterwards.
