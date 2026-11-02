---
title: Troubleshooting
description: Quick fixes for capture, the capture shortcut, model downloads, finding your Things library, Todoist tokens, sync and reminders.
section: help
order: 1
---

Each item below names something you want to work, and what to check.

## Capture with ⌘C twice

- **Check the switch:** **Settings → Capture & shortcuts → Press ⌘C twice to capture** should be on.
- **Check the menu bar:** the TodoCity icon should be there. If it isn't, open TodoCity from **Applications**.
- **Copy outside TodoCity.** Copies you make inside TodoCity itself don't count.
- **Press the second <kbd>⌘C</kbd> soon after the first**, on the same text.

<kbd>⌘C</kbd> twice needs no permission. Accessibility is only for the capture shortcut and Watch.

## Capture with the shortcut (⇧⌘S)

- **Allow Accessibility:** **System Settings → Privacy & Security → Accessibility**, turn on TodoCity, then press the shortcut again. The card says **Allow Accessibility to capture** when this is the fix.
- **Check the menu bar** for the TodoCity icon.
- **Another app uses the same keys?** Pick a new shortcut in **Settings → Capture & shortcuts**.

### Allow Accessibility again after an update

In **System Settings → Privacy & Security → Accessibility**, remove TodoCity with **–**, then capture again and allow it once more.

## “Select some text first”

Select the text again, then press the shortcut. Password fields always stay private. You can also right-click selected text and choose **Add to TodoCity**.

## “Copy the text first”

Your clipboard is holding something large, like an image. Copy the text with <kbd>⌘C</kbd>, then press the shortcut again.

## Add to TodoCity in the right-click menu

Open TodoCity from **Applications** once, then log out and back in. You can also turn it on in **System Settings → Keyboard → Keyboard Shortcuts → Services → Text**. Some apps list it under **Services**.

## Finish a model download

- **Resume it:** in **Settings → Open models**, click **Resume download**. It picks up where it stopped.
- **Download it again** if TodoCity says the file was changed on the way: each model is checked against its SHA-256 before it's used.
- **Keep going meanwhile:** until the model is ready, the capture card opens for you to fill in yourself.
- **Already have a GGUF model** from Ollama, LM Studio or Hugging Face? Use it with no download. See [AI models](/docs/ai-models#use-a-model-file-you-already-have).

## Find your Things library

- **Open Things 3 on this Mac first** and let it finish syncing. If you use Things only on iPhone or iPad, install Things 3 for Mac and sign in to Things Cloud.
- **Click Allow** if macOS asks whether TodoCity may access data from other apps.
- **Choose it yourself:** click **Choose the database myself…**, then in Finder choose **Go → Go to Folder…**, paste `~/Library/Group Containers/JLMPQHK86H.com.culturedcode.ThingsMac`, open the `ThingsData-…` folder and pick `Things Database.thingsdatabase`.
- **If macOS blocks it,** give TodoCity **Full Disk Access** in **System Settings → Privacy & Security**, or copy the `ThingsData-…` folder to your Desktop and choose the copy.

See [Things 3](/docs/connectors/things).

## Connect Todoist with a token

If TodoCity says “Todoist didn't accept that token”:

- **Copy it again** from Todoist: **Settings → Integrations → Developer → Copy API token**, and paste the whole token.
- **Issued a new token in Todoist?** The old one stops working; paste the new one.
- **No token?** Choose **No token? Use CSV files instead**. See [Todoist](/docs/connectors/todoist#no-token-use-csv-files).

## See a change sync

### Between your Macs

- **Keep both Macs open.** Changes show up within about 30 seconds while both are open, and a Mac that was asleep or offline catches up within a minute of coming back.
- **Click Sync now** in **Settings → Your other Macs**. The card shows whether it's up to date or how many changes are waiting to send.
- **Check Keep on this Mac only.** Projects switched on there stay on one Mac.
- **This Mac was removed from sync?** Its tasks are still here. Pair it again with a code. See [Sync between your Macs](/docs/sync-between-macs).

### With Todoist or Things 3

- **Click Sync now** in the app's card in **Settings → Connectors**. Otherwise it syncs every few minutes.
- **Check the project still syncs.** A project you stopped syncing from its **⋯** menu, or a task you moved into a project that doesn't sync, stays as it is in each app.
- **Many deletes at once?** The safety brake holds back a sync that would delete more than 20 tasks that are also more than half of the linked ones.
- **Using two Macs?** A new task or a finished repeat from your other Mac waits 10 minutes, so the Mac that made it goes first.

### With Apple Reminders or Calendar

Click **Sync now** in the card in **Settings → Connectors**. The card shows when it last synced.

## Get reminders

**Settings → Notifications** shows whether notifications are allowed for TodoCity, with **Open System Settings** to turn them on, and **Send a test** to check.

## Connect an agent

Move TodoCity to **Applications** and open it from there, then click **Connect** in **Settings → Agents**. **Test the connection**, under **More: another app, or test the connection**, checks it.

## Place the menu-bar icon

Hold <kbd>⌘</kbd> and drag it. macOS remembers the spot, including across updates.

## Something else

**Settings → Help → Log file** opens TodoCity's log. It stays on your Mac: attach it to an [issue on GitHub](https://github.com/pillieshwar/TodoCity/issues).
