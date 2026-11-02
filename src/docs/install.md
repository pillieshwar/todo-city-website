---
title: Install TodoCity
nav: Install
description: Download TodoCity for Mac, open it, allow the permissions you want to use, and keep it up to date on its own.
section: get-started
order: 2
---

TodoCity is a free Mac app. You download it once, drag it to Applications, and it lives in your menu bar from then on.

## What you need

- A Mac with macOS 11 Big Sur or later, Apple silicon or Intel.
- Room for one AI model. TodoCity downloads it from inside the app the first time you open it. See [AI models](/docs/ai-models) for the sizes.

There's no account to make, and nothing else to install.

## Download and open

:::steps
1. **Download.** Get [TodoCity-macOS.dmg](https://github.com/pillieshwar/TodoCity/releases/latest/download/TodoCity-macOS.dmg), the latest release.
2. **Open it** and drag **TodoCity** into **Applications**.
3. **Open TodoCity.** It's signed and notarized by Apple, so it opens like any other Mac app.
4. **Take the three-step tour.** Pick your on-device model, choose how you capture, and try a capture on a sample message. See [Quick start](/docs/quick-start).
:::

TodoCity opens at login. To change that, use **Settings → General → Open at login**.

> [!TIP]
> Keep TodoCity in **Applications**. Connecting AI agents works when TodoCity is opened from there.

## Permissions TodoCity asks for

macOS asks you before an app can read selected text, send notifications or use your calendars. TodoCity asks for each one only when you use the feature that needs it.

| Permission | What it's for | When TodoCity asks |
| --- | --- | --- |
| Accessibility | Reading the text you select, for the capture shortcut (<kbd>⇧⌘S</kbd>) and for Watch | When you choose the shortcut in the tour, or capture with it for the first time |
| Notifications | Reminding you when a task is due | When you finish the tour, since reminders are on from the start. Later: **Allow notifications…** in **Settings → Notifications** |
| Calendars | Showing your meetings and putting tasks in Apple Calendar | When you turn on **Apple Calendar** in **Settings → Connectors** |
| Reminders | Two-way sync with Apple Reminders | When you turn on **Apple Reminders** in **Settings → Connectors** |
| Data from other apps | Reading your Things 3 library | When you click **Find my Things library** |

Pressing <kbd>⌘C</kbd> twice needs no permission at all. It works in every app as soon as TodoCity is running.

### Allow Accessibility

:::steps
1. **Open System Settings → Privacy & Security → Accessibility.** In the tour, **Allow in System Settings** takes you there.
2. **Turn on TodoCity.**
3. **Press the shortcut again.** TodoCity picks it up straight away.
:::

> [!PRIVATE]
> Accessibility lets TodoCity read the text you select when you press the shortcut. The text goes to the model running on your Mac and nowhere else.

## Updates

TodoCity checks for updates on its own and downloads them quietly, so a new version never interrupts you.

- **In full screen**, a small **Update ready** shows in the footer once a new version is downloaded. Click it to see what's new and update.
- **In the side panel**, a note says the new version is ready, with **Update now** and **Later**. Your tasks stay as they are.

![The side panel with a note that a new version of TodoCity is ready, with Update now and Later](/docs/img/update-ready.webp "A new version, ready when you are.")

Your version number lives in **Settings → General → Updates**. There you can also click **Check now**, or **Restart to update** once a new version is ready. **Update automatically** checks once a day; turn it off to check only when you click **Check now**.

> [!PRIVATE]
> Update checks go to GitHub, where TodoCity's releases are published.

## Check your download (optional)

Every release is built by TodoCity's public release workflow and carries a signed build-provenance attestation. With the [GitHub CLI](https://cli.github.com) installed, you can check it:

```bash
gh attestation verify ~/Downloads/TodoCity-macOS.dmg --repo pillieshwar/TodoCity
```

## Uninstall

1. Quit TodoCity from its menu-bar icon.
2. Move TodoCity from **Applications** to the Bin.
3. Remove it from **System Settings → Privacy & Security → Accessibility**.

Your tasks and models stay in your [data folder](/docs/data) until you delete it. If you use [sync between your Macs](/docs/sync-between-macs), turn it off first in **Settings → Your other Macs**.
