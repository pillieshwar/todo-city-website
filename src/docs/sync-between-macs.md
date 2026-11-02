---
title: Sync between your Macs
description: Keep the same tasks on your work and personal Macs, with no iCloud or account. Pair with a code; every change is end-to-end encrypted.
section: connectors
order: 6
---

**Settings → Your other Macs** keeps your tasks the same on, say, a work laptop and a personal one, even when the work Mac can't sign in to iCloud. There's no account, and every change is encrypted on your Mac before it leaves.

## Pair two Macs

:::steps
1. **On one Mac, choose Show a code on this Mac.** It shows a code like `K7MX-4QRB` for 10 minutes.
2. **On the other Mac, choose I have a code**, type it in and click **Join**.
3. **Both Macs show six digits.** Check they're the same, then click **They match** on both.
:::

![Your other Macs, asking Do both Macs show this number? with six digits, They match and They don't](/docs/img/mac-sync-compare.webp "Matching digits mean the two Macs are talking only to each other.")

The six digits are how you know nothing came between your Macs. If they differ, click **They don't** and pair again.

Add more Macs the same way, with **+ Add a Mac**.

## How it syncs

- Changes on either Mac show up on the other within about 30 seconds while both are open.
- A Mac that was asleep or offline catches up within a minute of coming back.
- A Mac away for more than 30 days asks the others for a full copy when it's back.
- **Edits on two Macs at once?** Each detail keeps its newest edit. Rename a task on one Mac and tick it off on the other, and both changes stick.
- The card shows **Up to date** and when it last synced, or how many changes are waiting to send. **Sync now** syncs straight away.

## Keep a project on one Mac

Under **Keep on this Mac only**, switch on any project, say, a personal one on your work Mac. Its tasks stay on this Mac and leave your other Macs.

Projects kept on one Mac also stay out of Todoist and Apple Calendar.

## What stays per Mac

- Your [mode](/docs/modes): Work on the work laptop, Personal at home.
- Notifications and snoozes.
- Links to Apple Reminders.

## How it stays private

Your Macs share a key that's made on your Mac, handed over only inside the pairing (sealed with a secret the two Macs work out together) and kept in your Keychain. Every change is locked with it (ChaCha20-Poly1305) before it leaves your Mac.

In between sits a small relay that holds the sealed boxes until your other Macs pick them up, then deletes them, after 30 days at the latest. The relay never has the key, so it can't read task titles, notes, projects or Mac names. It keeps no logs, and there's no account behind it.

> [!PRIVATE]
> Sync between your Macs is end-to-end encrypted. The key exists only on your Macs, in the Keychain.

## Stop syncing

- **Remove…** another Mac from the list.
- **Turn off sync on this Mac…**: its tasks stay here, and your other Macs keep theirs.

**Lost a Mac?** Turn sync off on your other Macs and pair them again. That makes a new key the lost Mac doesn't have.
