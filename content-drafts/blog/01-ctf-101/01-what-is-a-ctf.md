---
title: What Is a CTF? A Complete Beginner's Guide
slug: what-is-a-ctf-beginners-guide
category: CTF 101
description: A CTF (Capture The Flag) is a cybersecurity competition where you solve hacking challenges to find hidden strings called flags. Here's how they work and how to start.
suggested_author: (assign to whichever team member writes this)
---

# What Is a CTF? A Complete Beginner's Guide

A CTF, or Capture The Flag, is a cybersecurity competition where participants solve hacking-style challenges to find a hidden piece of text called a "flag" — usually something like `flag{y0u_f0und_m3}`. Submit the correct flag, earn points, climb the leaderboard. That's the entire game, dressed up in as many different forms as there are ways to break a computer system.

If you've ever wondered how people learn to "hack" legally, CTFs are the answer. They're the closest thing cybersecurity has to a sport — practiced by students prepping for a career, professionals sharpening real skills, and hobbyists who just like breaking things safely.

## How does a CTF actually work?

Organizers build a set of challenges, each hiding a flag behind some kind of security weakness. Your job is to find and exploit that weakness to extract the flag. A challenge might be:

- A website with a hidden vulnerability you need to exploit (web exploitation)
- An encrypted message you need to break (cryptography)
- A suspicious file that's hiding something inside it (forensics)
- A program you need to reverse-engineer to find a secret (reverse engineering)
- A public figure's social media trail you need to piece together (OSINT)

Each challenge has a point value, usually scaled to difficulty. Solve it, submit the flag, get the points. Most competitions run on a live leaderboard, so you can watch your score — and everyone else's — move in real time.

## What skills do you need to start?

Less than you'd think. Most CTF platforms, including gopwnit, structure challenges from beginner to advanced, and a beginner track typically only assumes:

- Basic comfort with a Linux terminal
- A little bit of networking knowledge (what a port is, what HTTP does)
- Curiosity and a willingness to Google things you don't know yet

You don't need to already know how to "hack." You need to be willing to try things, read error messages carefully, and follow a thread of clues. Everything else — the actual technical skills — you build by doing the challenges.

## Jeopardy-style vs. attack-defense: the two main formats

Most CTFs you'll encounter fall into one of two formats:

**Jeopardy-style** is the most common, especially for beginners. Challenges are laid out like a game show board, organized by category and difficulty. You pick which challenge to attempt, in any order, and solve independently. This is the format gopwnit's seasons use.

**Attack-defense** is more advanced. Each team runs its own vulnerable server and has to simultaneously defend it while attacking everyone else's. It's faster-paced, more chaotic, and generally not where beginners start.

If you're new, look for jeopardy-style events first.

## Solo or team?

Both exist, and neither is "more correct." Solo competitions test your own range across categories. Team competitions let you specialize — one person handles crypto, another handles web, another handles forensics — and combine your points. gopwnit supports both formats depending on how a given season is configured.

## Where do I actually start?

1. **Pick a beginner-friendly platform.** Look for one with a structured learning path, not just a wall of hard challenges.
2. **Start with the fundamentals.** Linux basics and networking aren't optional — they're the floor everything else is built on.
3. **Join a live or ongoing event**, even if you don't finish a single challenge. Watching how challenges are structured teaches you more than reading about them.
4. **Read write-ups after (not during) a competition.** Seeing how others solved a challenge you got stuck on is one of the fastest ways to learn.

## Frequently asked questions

**Is CTF hacking illegal?**
No. Every CTF challenge runs in a sandboxed environment specifically built to be attacked — that's the entire point. You're never touching a real, unauthorized system.

**Do I need to know how to code?**
Not to start. Basic scripting (Python is the most common) becomes useful as you progress, but plenty of beginner challenges don't require writing a single line of code.

**How long does a CTF competition last?**
It varies. Some run for a few hours, others (like gopwnit's seasons) run over several days, giving you room to work through challenges at your own pace.

---

*Ready to try one? [Explore gopwnit's labs and CTF challenges](/platform) or see [what's coming up next](/events).*
