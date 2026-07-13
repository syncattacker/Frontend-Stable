---
title: "Jeopardy vs. Attack-Defense: The Two Main CTF Formats"
slug: jeopardy-vs-attack-defense-ctf
category: CTF 101
description: Jeopardy-style CTFs let you pick challenges from a categorized board and solve independently. Attack-defense pits teams against each other in real time. Here's the difference.
suggested_author: (assign to whichever team member writes this)
---

# Jeopardy vs. Attack-Defense: The Two Main CTF Formats

Almost every CTF competition you'll come across runs on one of two formats: jeopardy-style or attack-defense. They test overlapping skills but feel completely different to play, and knowing which one you're walking into changes how you should prepare.

## Jeopardy-style CTFs

This is the format most beginners start with, and the one gopwnit's seasons use. Challenges are laid out on a board, grouped by category (cryptography, web exploitation, forensics, and so on) and difficulty. You choose which challenge to attempt, in any order, and work on it independently — there's no opponent to race against beyond the clock and the leaderboard.

**What it tests:** Depth of knowledge in specific categories, problem-solving under a mild time pressure, and the ability to work through a challenge methodically without anyone interfering with your environment.

**Why it's beginner-friendly:** You control the pace. If a cryptography challenge isn't clicking, you can switch to a forensics challenge and come back later. There's no risk of someone actively working against you mid-solve.

## Attack-defense CTFs

This format is faster, more chaotic, and generally aimed at more experienced players. Every team is given an identical set of vulnerable services running on their own server. The objective is twofold: patch and defend your own services from being exploited by other teams, while simultaneously finding and exploiting the same vulnerabilities on everyone else's servers.

Scoring usually combines two things: points for successfully "attacking" (extracting a flag from) another team's service, and points lost when your own service gets successfully attacked or goes down.

**What it tests:** Real-time system administration, rapid vulnerability patching, and offensive skills under active pressure — closer to what an actual incident response or red-team scenario feels like.

**Why it's harder for beginners:** You need a baseline of skill just to keep your own systems running while also attacking others. Mistakes are punished immediately and visibly, since a broken service is either down (costing you points) or wide open (costing you more).

## Which one should you start with?

Jeopardy-style, without much debate. It lets you build category-specific skills at your own pace, with immediate, isolated feedback on each challenge. Attack-defense is worth trying once you're comfortable with the fundamentals — recon, exploitation, and at least basic system administration — since going in without that foundation usually means spending the whole event just trying to keep your service alive.

## A hybrid worth knowing about: King of the Hill

Less common, but worth a mention — King of the Hill format has teams compete to gain and hold control of a single shared vulnerable machine, scoring points for every minute they control it. It borrows the "live, adversarial" feel of attack-defense without requiring you to maintain your own infrastructure.

## Frequently asked questions

**Can a single event mix both formats?**
Some larger competitions run a jeopardy-style qualifier followed by an attack-defense final for top teams. It's a good structure for separating beginner-friendly entry from a more advanced finals stage.

**Does gopwnit run attack-defense events?**
gopwnit's seasons currently run jeopardy-style, solo and team formats. If that changes, it'll show up on the [Events page](/events).

**Is one format "more real" than the other?**
Attack-defense more closely mirrors live incident response and infrastructure defense. Jeopardy-style more closely mirrors focused vulnerability research. Most real security work draws on both.

---

*Start with jeopardy-style challenges on [gopwnit's platform](/platform), or see what's [coming up next](/events).*
