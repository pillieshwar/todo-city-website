# TodoCity Docs: how to write a page

Each `.md` file here is one page at `todocity.app/docs/…`: `install.md` is `/docs/install`, `connectors/todoist.md` is `/docs/connectors/todoist`, and `index.md` is `/docs`. This README isn't a page.

The pages are built at build time by `scripts/docs-content.mjs` (Markdown → HTML, headings, search words) and rendered by `src/docs-site/`. They're prerendered like the rest of the site, so they work without JavaScript.

## Frontmatter

```yaml
---
title: Install TodoCity          # the H1 and the <title>
nav: Install                      # optional: a shorter name for the sidebar and breadcrumb
description: Download TodoCity…   # the subtitle under the H1 and the meta description (under ~155 characters)
section: get-started              # an id from sections.json (the top tabs)
order: 2                          # position within the section
---
```

A page whose path sits under another page's path in the same section (`connectors/todoist` under `connectors`) shows as a child of it in the sidebar.

## Building blocks

- **Headings:** start at `##`. The title is the H1. Every `##` is listed in “On this page”.
- **Steps:** a numbered list between `:::steps` and `:::`. Start each step with a bold phrase.
- **Callouts:** `> [!NOTE]`, `> [!TIP]` or `> [!PRIVATE]` (shown as “Private by default”) on the first line of a quote. There is no warning tone: state the fact calmly and say what to do.
- **“What goes where” tables:** an ordinary Markdown table; the first column is the other app, the second is TodoCity.
- **Keys:** `<kbd>⌘C</kbd>`.
- **Screenshots:** a paragraph with only an image becomes a figure; its title is the caption: `![Alt text that describes it](/docs/img/today.webp "Caption.")`. Images live in `public/docs/img/` (WebP, 1440 px wide for full-screen shots). Use only shots from the app repo's `ui-previews` branch, which use made-up data.
- **Missing screenshot:** leave `<!-- TODO screenshot: what it should show -->`. It doesn't show on the site.
- **Link lists** (overview pages): a list between `:::cards` and `:::`, each line `- [Title](/docs/page) One line about it.` They show as a two-column list with an icon picked from where the link goes (`ICON_PATHS` in `scripts/docs-content.mjs`).
- **Start here:** `:::start`, the left column, a line with only `+++`, the right column, then `:::`. For the fastest path on an overview page.
- **Button:** `[Download for Mac]({{download}} "button")`, a link whose title is `button`.
- **Variables:** `{{version}}` (the newest version in `whats-new.json`), `{{download}}`, `{{requirements}}` and `{{repo}}`, set once in `VARS` in `scripts/docs-content.mjs`. An unknown name stops the build.
- **Links are checked:** every `/docs/…` link and `#anchor` must lead to a page and heading, or the build stops.
- **Release notes:** `:::release-notes` on its own line expands `whats-new.json`.

## Release notes

`whats-new.json` is a copy of `src/whats-new.json` from the app repo. Refresh it after each app release:

```bash
npm run docs:release-notes
```

## Writing rules

- Plain, calm and exact. Short sentences, second person, present tense. Lead with what the page is for in one line.
- Every fact comes from the app's code, README or CLAUDE.md. Use the app's exact labels in bold: **Settings → Connectors → Todoist**.
- Say what to do (“Select some text first”), never that something is missing or broken.
- Privacy claims match the app's README. Any feature that sends data says where it goes.
- Plain words (projects, sections, tasks) on task pages; city words (buildings, floors, residents) only on the city page.
- Made-up names only: Sam, Maya, Priya, Dana.
