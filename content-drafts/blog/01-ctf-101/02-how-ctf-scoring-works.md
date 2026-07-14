---
title: How CTF Scoring Works
slug: how-ctf-scoring-works
category: CTF 101
description: CTF challenges are worth points based on difficulty. Solve one, and its points add to your score instantly, tracked on a live leaderboard for solo and team play.
suggested_author: (assign to whichever team member writes this)
---

# How CTF Scoring Works

Every CTF challenge is worth a set number of points, usually scaled to how difficult it is. Solve the challenge, submit the correct flag, and those points are added to your score immediately. Your total score determines your position on the leaderboard — that's the whole mechanism, though a few details are worth understanding before your first competition.

## Points are set by difficulty, not by time

Unlike some competitive formats, most modern CTF platforms — gopwnit included — assign points based on how hard a challenge is, not how fast you solve it. An easy web exploitation challenge might be worth 50 points; a hard binary exploitation challenge might be worth several hundred. This rewards depth of skill over speed, which is a better reflection of real security work.

Some legacy CTF platforms used dynamic scoring, where a challenge's point value *drops* the more people solve it (to reward first-solvers more). Static, difficulty-based scoring is simpler to reason about and is what you'll encounter most often today.

## Solo vs. team leaderboards

If a competition supports both formats, scoring is tracked separately — your individual score if you're playing solo, or your team's combined score if you've joined one. A five-person team's total is the sum of every challenge any member solved; there's no scoring penalty for splitting up categories.

## What happens the moment you solve a challenge?

You submit the flag, the system verifies it against the stored answer, and if it matches, your score updates immediately. There's no waiting for a manual review or a batch grading cycle — this is what makes CTF leaderboards feel alive during a live event, with rankings visibly shifting as people solve challenges in real time.

## Do flags stay the same for everyone?

It depends on the platform and the challenge. Static flags are identical for every participant. Some platforms generate per-team or per-user unique flags for certain challenges specifically to prevent flag-sharing between participants — worth knowing, since submitting someone else's flag on a platform using unique flags will simply fail.

## Why do challenge flags matter for fairness?

A CTF's integrity depends on flags being genuinely hard to find without doing the work, and hard to leak. On gopwnit, challenge flags are hashed at rest in the database — the same way passwords are — specifically so that even a full database compromise wouldn't hand out every answer. That's a security detail most players never think about, but it's part of what keeps a leaderboard meaningful.

## A quick example

Say a season has 10 challenges: 4 easy (50 points each), 4 medium (100 points each), and 2 hard (200 points each) — 1,000 points total available. A player who solves all four easy and two medium challenges finishes with 400 points. Someone who solves fewer challenges but picks off both hard ones plus two easy ones ends up at 500 points. Difficulty-based scoring means breadth and depth are both valid strategies.

## Frequently asked questions

**Can my score go down?**
No — points are only added when you solve a challenge. There's no penalty for wrong guesses on most platforms, though some do rate-limit repeated incorrect submissions to discourage brute-forcing.

**What's a "first blood" bonus?**
Some CTFs award a small bonus to whoever solves a given challenge first. Not every platform uses this — check the specific season's rules before assuming it applies.

**Is the leaderboard visible during the competition?**
Usually yes, which is part of the appeal — you can watch your rank move as you and everyone else solves challenges in real time.

---

*See the full breakdown of challenge categories and formats on the [Platform page](/platform).*
