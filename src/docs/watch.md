---
title: Watch
description: Watch spots requests, deadlines and your own promises in the app in front, and suggests them as tasks for you to approve. Off until you turn it on.
section: agents
order: 3
---

**Watch** notices to-dos as they come up on your screen, like a request in a chat or a promise you made in an email, and suggests them as tasks for you to approve. It's off until you turn it on in **Settings → Watch**.

![Settings → Watch: Watch my screen, and Send to set to Open model on this Mac](/docs/img/settings-watch.webp "Settings → Watch.")

## Turn it on

:::steps
1. **Open Settings → Watch** and turn on **Watch my screen**.
2. **Allow Accessibility** if TodoCity asks. Watch reads the text of the window in front through it.
3. **Choose who reads** new messages under **Send to**.
4. **Add your name** under **Your name**, so your own promises count.
:::

## What Watch reads, and what it never reads

Watch reads the text of the window in front of you and keeps none of it. Only new lines that look like to-dos go on to the reader you choose.

It never reads:

- password managers
- Keychain
- System Settings
- terminals
- TodoCity itself
- what you type, or password fields

There are no screenshots and no recording. Under **Apps**, you can skip any other app too.

## Choose a reader

| Reader | Where your text goes |
| --- | --- |
| **Open model on this Mac** | Stays on your Mac. See [AI models](/docs/ai-models) |
| An agent you've connected: Claude Code, Codex, Antigravity, Gemini or Cursor | To that agent, signed in as you, and on to its AI service |

Only agents you've connected in **Settings → Agents** are offered. An agent is asked at most 40 times an hour. Its answers are checked the same way as the open model's.

> [!PRIVATE]
> With the open model as the reader, everything Watch reads stays on your Mac. With an agent, new lines that look like to-dos go to that agent and its AI service.

## Your name

Watch counts your own promises, like “I'll send it Monday”, and leaves other people's alone. For that it needs your name. Add other forms with semicolons, like `Rivera, Sam; sam@example.com`.

## Suggestions

Each suggestion waits for your approval, like a capture: **Add** or **Discard** each one, or **Add all**.

![Noticed on screen: 2 to-dos in Slack, each with its day and where it was noticed, with Add and Discard](/docs/img/watch-suggestions.webp "Suggestions from Watch, waiting for you.")

**Show suggestions right away** opens the menu-bar dropdown as soon as a to-do is spotted; with it off, they wait quietly behind a banner.

## Battery and breaks

- **Only when plugged in** saves battery: Watch starts when your Mac is plugged in.
- **Pause 1 hour** gives you a break; **Resume** starts again.
- Settings shows Watch's last look: which app, when, and how many lines were new.
