---
title: Dates and times
description: How plain words become a day, a time, a deadline and a repeat. Code on your Mac works out every date, and asks when a phrase fits two days.
section: capture
order: 3
---

Write dates the way you'd say them. “by Friday 3pm”, “tomorrow evening” and “every Sunday” become a real day, time, deadline or repeat, whether you capture text or type a task.

## Code works out the date, not the AI

When you capture text, the model only copies the date phrase it finds, like “by Friday 3pm”. Code on your Mac then turns that phrase into a day, a time and a repeat, counting from today's real date. The same words always give the same answer.

Tasks you type, in Quick Add or the app's add field, are read by the same code, with no model involved.

![The date editor with “fri 3pm every week” typed, read as Friday at 3:00 PM, every week](/docs/img/date-editor.webp "Type a date in plain words, and see how TodoCity reads it.")

## Days

| You write | TodoCity reads |
| --- | --- |
| today, tonight, tomorrow, the day after tomorrow | That day |
| in 3 days, in two weeks, in 3 business days | Counted from today |
| friday, this friday | The coming Friday |
| next friday | Friday of next week, with this week's Friday offered too when it's still ahead |
| friday next week | Friday of next week |
| end of the week, eow | Friday of this week |
| next week | Monday of next week |
| end of next week | Friday of next week |
| the weekend | The coming Saturday |
| end of the month, eom | The last day of this month |
| next month | The 1st of next month |
| oct 20, 20 october, 10/20 | That date (the next one to come) |

Numeric dates like `3/4` follow your Mac's region for which number is the month.

## Times

| You write | Time |
| --- | --- |
| 3pm, 3:30pm, 15:30, 9:07 | That time, to the minute. A time on its own is today if it's still ahead, otherwise tomorrow |
| at 5 | 5:00 PM (an hour from 1 to 7 reads as afternoon) |
| noon, midday, lunchtime | 12:00 PM |
| eod, end of day, close of business | 5:00 PM |
| morning | 9:00 AM |
| afternoon | 2:00 PM |
| evening | 6:00 PM |
| tonight | 8:00 PM today |

## Deadlines

A phrase that starts with **by**, **before**, **due**, **no later than**, **until** or **deadline** sets a **deadline**: the day the task must be done by. “by Friday” gives the task a Friday deadline, and the task shows in Today when that day comes, even if you planned it for later. See [Tasks](/docs/tasks#deadline).

## Repeats

| You write | Repeat |
| --- | --- |
| every day, daily, every morning | Every day |
| every weekday, weekdays | Monday to Friday |
| every week, weekly, every monday | Every week |
| every other week, every 2 weeks, biweekly | Every 2 weeks |
| every month, monthly | Every month |
| every year, yearly, annually | Every year |
| every 3 days | Every 3 days |
| every mon and wed | Every week on Monday and Wednesday |
| every other tuesday | Every 2 weeks on Tuesday |
| the 15th of every month | Monthly, on the 15th |
| the 2nd tuesday of the month | Monthly, on the 2nd Tuesday |
| the last day of every month | Monthly, on the last day |
| every weekday until dec 18 | Monday to Friday, ending December 18 |

More ways to repeat, including counting from when you finish, are in [Repeats](/docs/repeats).

## Length, priority and tags

When you add a task in the app (**Add Task**, or <kbd>A</kbd> in a list), a few more words set its details:

- **@Name**: the project it goes in.
- **for 30 min**, **for 1h30**, **for half an hour**: how long it takes. Only after “for”, so “call in 30 min” stays a time.
- **p1**, **p2**, **p3**: priority P1 (urgent), P2 (high) or P3 (medium).
- **#home**, **#work**: tags.

```text
Stand-up tomorrow 9:07 for 7 min p2 #work
```

## When a phrase fits two days

TodoCity asks instead of guessing. “next Friday” said on a Tuesday could mean this week's Friday or next week's, and `3/4` could be March 4 or April 3. The capture card offers both readings, and you pick the one you meant. See [Review a capture](/docs/capture/review#when-a-date-could-mean-two-days).
