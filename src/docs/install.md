---
title: Install TodoCity
nav: Install
description: Download TodoCity for Mac, open it, allow the permissions you want to use, and keep it up to date on its own.
section: get-started
order: 2
---

TodoCity is a free Mac app. You download it once, drag it into Applications, and from then on it lives in your menu bar.

## What you need

- A Mac with {{requirements}}.
- Enough space for one AI model, which TodoCity downloads from inside the app the first time you open it. [AI models](/docs/ai-models) lists how big each one is.

You don't need an account, and there's nothing else to install.

## Download and open

:::steps
1. **Download.** Get [TodoCity-macOS.dmg]({{download}}), the latest release (version {{version}}).
2. **Open it** and drag **TodoCity** into **Applications**.
3. **Open TodoCity.** It's signed and notarized by Apple, so it opens just like any other Mac app.
4. **Take the three-step tour.** You'll pick your on-device model, choose how you want to capture, and try it out on a sample message. See [Quick start](/docs/quick-start).
:::

TodoCity opens automatically when you log in. If you'd rather it didn't, turn off **Settings → General → Open at login**.

> [!TIP]
> Keep TodoCity in **Applications**. Connecting AI agents only works when TodoCity is opened from there.

## Permissions TodoCity asks for

Before an app can read the text you select, send notifications or use your calendars, macOS asks you first. TodoCity only asks for each permission when you start using the feature that needs it.

| Permission | What it's for | When TodoCity asks |
| --- | --- | --- |
| Accessibility | Reading the text you select, for the capture shortcut (<kbd>⇧⌘S</kbd>) and for Watch | When you choose the shortcut in the tour, or the first time you capture with it |
| Notifications | Reminding you when a task is due | When you finish the tour, since reminders are on from the start. Later on: **Allow notifications…** in **Settings → Notifications** |
| Calendars | Showing your meetings and putting tasks in Apple Calendar | When you turn on **Apple Calendar** in **Settings → Connectors** |
| Reminders | Syncing both ways with Apple Reminders | When you turn on **Apple Reminders** in **Settings → Connectors** |
| Data from other apps | Reading your Things 3 library | When you click **Find my Things library** |

Pressing <kbd>⌘C</kbd> twice doesn't need any permission. It works in every app as soon as TodoCity is running.

### Allow Accessibility

:::steps
1. **Open System Settings → Privacy & Security → Accessibility.** If you're in the tour, **Allow in System Settings** takes you straight there.
2. **Turn on TodoCity.**
3. **Press the shortcut again.** TodoCity picks up your selection right away.
:::

> [!PRIVATE]
> Accessibility lets TodoCity read the text you've selected when you press the shortcut. That text goes to the model running on your Mac, and nowhere else.

## Updates

TodoCity checks for updates by itself and downloads them in the background, so a new version never gets in your way.

- **In full screen**, a small **Update ready** appears in the footer once the new version has downloaded. Click it to see what's new and update.
- **In the side panel**, a note tells you the new version is ready, with **Update now** and **Later**. Your tasks stay just as they are.

![The side panel with a note that a new version of TodoCity is ready, with Update now and Later](/docs/img/update-ready.webp "A new version, ready when you are.")

You'll find your version number in **Settings → General → Updates**. You can click **Check now** there, or **Restart to update** once a new version is waiting. **Update automatically** checks once a day. If you turn it off, TodoCity only checks when you click **Check now**.

> [!PRIVATE]
> Update checks go to GitHub, which is where TodoCity's releases are published.

## Check your download (optional)

Every release is built by TodoCity's public release workflow and comes with a signed build-provenance attestation. If you have the [GitHub CLI](https://cli.github.com) installed, you can verify it yourself:

```bash
gh attestation verify ~/Downloads/TodoCity-macOS.dmg --repo pillieshwar/TodoCity
```

## Uninstall

1. Quit TodoCity from its menu-bar icon.
2. Move TodoCity from **Applications** to the Bin.
3. Remove it from **System Settings → Privacy & Security → Accessibility**.

Your tasks and models stay in your [data folder](/docs/data) until you delete it yourself. If you use [sync between your Macs](/docs/sync-between-macs), turn it off in **Settings → Your other Macs** before you uninstall.
