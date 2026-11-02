---
title: Capture text from any app
nav: Capture
description: Turn an email, a message or a web page into a task. Press ⌘C twice, use the capture shortcut, right-click, or type it with Quick Add.
section: capture
order: 1
---

Capture turns text from any app into a task. TodoCity reads the text with the model on your Mac, writes the task and its date, and shows you a card to check before it's saved.

![A capture card under the menu-bar icon: the task Send Q3 numbers to Priya, read as Friday at 3:00 PM, with Discard and Add task](/docs/img/capture-card.webp "The card that drops down after a capture.")

## Press ⌘C twice

:::steps
1. **Copy the text** as usual with <kbd>⌘C</kbd>.
2. **Press <kbd>⌘C</kbd> again** within a moment.
3. **Check the card** and press <kbd>Return</kbd>.
:::

This works in every app and needs no permission. TodoCity watches for the same text copied twice in a row, so <kbd>⌘C</kbd> keeps working as usual everywhere. Copies you make inside TodoCity itself don't count.

To turn it on or off, use **Settings → Capture & shortcuts → Press ⌘C twice to capture**.

## Use the capture shortcut

Select text and press <kbd>⇧⌘S</kbd>. There's no copying at all.

- The shortcut reads your selection through macOS Accessibility, so allow it once in **System Settings → Privacy & Security → Accessibility**. See [Install](/docs/install#allow-accessibility).
- Pick another key in **Settings → Capture & shortcuts**: click **Change shortcut**, then press the new keys.
- Password fields always stay private.

## Right-click → Add to TodoCity

Select text, right-click and choose **Add to TodoCity**. Some apps list it under **Services**.

If you don't see it yet, open TodoCity from **Applications** once, then log out and back in. You can also turn it on in **System Settings → Keyboard → Keyboard Shortcuts → Services → Text**.

## Quick Add

Press <kbd>⇧⌘Space</kbd> anywhere and type the task, with its date in plain words:

```text
pay rent friday 5pm every month #home
```

TodoCity shows how it reads the date as you type, then adds the task. No AI is needed for this: code on your Mac reads the date. See [Dates and times](/docs/dates-and-times).

![Quick Add with “pay rent friday 5pm every month #home” typed, read as Friday at 5:00 PM](/docs/img/quick-add.webp "Quick Add reads the date as you type.")

In the app's own add field, type `@Name` to put the task in a project.

## What happens to your clipboard

- **<kbd>⌘C</kbd> twice** uses the text you copied. It stays on your clipboard, as it would after any copy.
- **The shortcut** reads the selection directly. If an app doesn't share its selection, TodoCity copies it for you and then puts your clipboard back as it was. It leaves the clipboard alone if anything else changed it in the meantime, or if it holds images or files.
- **Add to TodoCity** gets the text straight from macOS and doesn't touch the clipboard.

> [!PRIVATE]
> What you capture goes to the model running on your Mac and nowhere else.

## Lists become sub-tasks

Capture a bulleted or numbered list (two items or more) and its lines become the task's sub-tasks.

## Where the card shows

The card drops down from the TodoCity icon in the menu bar. To review captures in the side panel instead, turn off **Settings → Capture & shortcuts → Review captures in the menu bar**.

Next: [Review a capture](/docs/capture/review).
