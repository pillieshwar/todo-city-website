---
title: Troubleshooting
description: Quick fixes for capture, the capture shortcut, model downloads, finding your Things library, Todoist tokens, sync and reminders.
section: help
order: 1
---

Each section below covers something you're trying to get working, and what to check if it isn't.

## Capture with ⌘C twice

- **Check the switch.** **Settings → Capture & shortcuts → Press ⌘C twice to capture** should be on.
- **Check the menu bar.** You should see the TodoCity icon there. If you don't, open TodoCity from **Applications**.
- **Copy from another app.** Anything you copy inside TodoCity itself doesn't count.
- **Press <kbd>⌘C</kbd> the second time straight after the first**, with the same text selected.

Pressing <kbd>⌘C</kbd> twice doesn't need any permission. Accessibility is only needed for the capture shortcut and Watch.

## Capture with the shortcut (⇧⌘S)

- **Allow Accessibility.** Go to **System Settings → Privacy & Security → Accessibility**, turn on TodoCity, then press the shortcut again. If this is what's needed, the card will say **Allow Accessibility to capture**.
- **Check the menu bar** to make sure the TodoCity icon is there.
- **Does another app use the same keys?** Pick a different shortcut in **Settings → Capture & shortcuts**.

### Allow Accessibility again after an update

Sometimes macOS needs a fresh go after an update. In **System Settings → Privacy & Security → Accessibility**, remove TodoCity with **–**, then capture again and allow it once more.

## “Select some text first”

Select the text again and press the shortcut. Keep in mind that password fields always stay private. You can also right-click the selected text and choose **Add to TodoCity**.

## “Copy the text first”

This means your clipboard is holding something large, like an image. Copy the text with <kbd>⌘C</kbd>, then press the shortcut again.

## Add to TodoCity in the right-click menu

Open TodoCity from **Applications** once, then log out and back in. You can also switch it on in **System Settings → Keyboard → Keyboard Shortcuts → Services → Text**. In some apps, you'll find it under **Services**.

## Finish a model download

- **Resume it.** In **Settings → Open models**, click **Resume download**, and it picks up where it left off.
- **Download it again** if TodoCity says the file was changed on the way. Every model is checked against its SHA-256 before it's used.
- **Carry on in the meantime.** Until the model is ready, the capture card opens for you to fill in yourself.
- **Already have a GGUF model** from Ollama, LM Studio or Hugging Face? You can use it without downloading anything. See [AI models](/docs/ai-models#use-a-model-file-you-already-have).

## Find your Things library

- **Open Things 3 on this Mac first** and let it finish syncing. If you only use Things on your iPhone or iPad, install Things 3 for Mac and sign in to Things Cloud.
- **Click Allow** if macOS asks whether TodoCity can access data from other apps.
- **Choose it yourself.** Click **Choose the database myself…**, then in Finder choose **Go → Go to Folder…**, paste `~/Library/Group Containers/JLMPQHK86H.com.culturedcode.ThingsMac`, open the `ThingsData-…` folder and pick `Things Database.thingsdatabase`.
- **If macOS blocks it**, give TodoCity **Full Disk Access** in **System Settings → Privacy & Security**, or copy the `ThingsData-…` folder to your Desktop and choose the copy.

See [Things 3](/docs/connectors/things).

## Connect Todoist with a token

If TodoCity says “Todoist didn't accept that token”, try these:

- **Copy it again** from Todoist, using **Settings → Integrations → Developer → Copy API token**, and make sure you paste the whole thing.
- **Made a new token in Todoist?** The old one stops working, so paste the new one.
- **No token?** Choose **No token? Use CSV files instead**. See [Todoist](/docs/connectors/todoist#no-token-use-csv-files).

## See a change sync

### Between your Macs

- **Keep both Macs open.** While both are open, changes show up within about 30 seconds. A Mac that was asleep or offline catches up within a minute of coming back.
- **Click Sync now** in **Settings → Your other Macs**. The card tells you whether it's up to date, or how many changes are waiting to send.
- **Check Keep on this Mac only.** Any project switched on there stays on one Mac.
- **Was this Mac removed from sync?** Its tasks are still here. Just pair it again with a code. See [Sync between your Macs](/docs/sync-between-macs).

### With Todoist or Things 3

- **Click Sync now** on the app's card in **Settings → Connectors**. Otherwise, it syncs every few minutes.
- **Check that the project still syncs.** If you stopped syncing a project from its **⋯** menu, or moved a task into a project that doesn't sync, it stays as it is in each app.
- **Deleted a lot at once?** The safety brake holds back any sync that would delete more than 20 tasks when that's also more than half of the linked ones.
- **Using two Macs?** New tasks and finished repeats from your other Mac wait 10 minutes, so the Mac that made the change goes first.

### With Apple Reminders or Calendar

Click **Sync now** on the card in **Settings → Connectors**. The card also shows when it last synced.

## Get reminders

**Settings → Notifications** tells you whether TodoCity is allowed to send notifications. If it isn't, click **Open System Settings** to turn them on, then use **Send a test** to check.

## Connect an agent

Move TodoCity into **Applications** and open it from there, then click **Connect** in **Settings → Agents**. To make sure it worked, use **Test the connection** under **More: another app, or test the connection**.

## Place the menu-bar icon

Hold <kbd>⌘</kbd> and drag it wherever you like. macOS remembers the spot, even after updates.

## Something else

If you're still stuck, **Settings → Help → Log file** opens TodoCity's log. It stays on your Mac unless you share it, so attach it to an [issue on GitHub](https://github.com/pillieshwar/TodoCity/issues) and we'll take a look.
