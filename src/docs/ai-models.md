---
title: AI models on your Mac
nav: AI models
description: TodoCity writes tasks with a small open model that runs on your Mac. Add, switch or remove models in Settings → Open models.
section: capture
order: 4
---

TodoCity reads what you capture with a small open model that runs on your Mac. It downloads once, then works offline. Manage it in **Settings → Open models**.

![Settings → Open models: Qwen3.5 4B, marked Best for your Mac and In use, with Gemma 4 E4B and Qwen3.5 2B to download](/docs/img/settings-open-models.webp "Settings → Open models.")

## The models

TodoCity lists a few small models picked from its own tests of turning messages into tasks. All three are under the Apache 2.0 license.

| Model | Download | Memory | Good for |
| --- | --- | --- | --- |
| Qwen3.5 4B | 3.0 GB | 8 GB or more | The all-rounder: fast, accurate, and it rarely suggests a to-do that isn't one |
| Gemma 4 E4B | 5.0 GB | 16 GB or more | Misses the fewest to-dos; larger, and about three times slower |
| Qwen3.5 2B | 1.3 GB | 4 GB or more | The lightest: quick captures on smaller Macs |

The model that fits your Mac's memory is marked **Best for your Mac**. The model TodoCity uses now is marked **In use**.

## Add a model

:::steps
1. **Open Settings → Open models.**
2. **Click Download** on the model you want. You can **Pause** a download and **Resume download** later, picking up where it stopped.
3. **Start capturing.** With more than one model downloaded, TodoCity uses the best one you have.
:::

> [!PRIVATE]
> Models download from Hugging Face, and each file is checked against its SHA-256 before TodoCity uses it. After that, capture runs entirely on your Mac.

## Use a model file you already have

Already have a GGUF model from Ollama, LM Studio or Hugging Face? Use it with no download:

:::steps
1. **Open Already have a model file?** at the bottom of **Settings → Open models**.
2. **Copy the file's path.** In Finder, right-click the file, hold <kbd>⌥</kbd> and choose **Copy as Pathname**.
3. **Paste it** and click **Use file**.
:::

Model files TodoCity finds on your Mac show under **Found on this Mac**, each with **Use**. To switch back, click **Use TodoCity's models**.

## Remove a model

Click **Remove** on a downloaded model, then **Delete** to free its space. For a model file of your own, **Remove from TodoCity** makes TodoCity forget it; the file itself stays where it is.

## Memory and battery

The model runs only when TodoCity needs it. It starts when you capture, and stops after five minutes without use to give the memory back. It also stops when you switch models or quit TodoCity.

## Without a model

Everything in TodoCity works before you add a model. When you capture, the card opens with your text for you to write the task yourself, and dates you type are still read for you. Add a model whenever you like.

## Watch

[Watch](/docs/watch) can use the open model on your Mac to spot to-dos on your screen, or send them to an AI agent you've connected. The lightest model suggests more to-dos that aren't really to-dos when watching, so a larger one suits Watch better.
