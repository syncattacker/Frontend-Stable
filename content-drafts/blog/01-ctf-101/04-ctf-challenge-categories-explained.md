---
title: The 10 CTF Challenge Categories, Explained
slug: ctf-challenge-categories-explained
category: CTF 101
description: CTF challenges fall into recognizable categories — cryptography, web exploitation, forensics, and more. Here's what each one actually tests, in plain language.
suggested_author: (assign to whichever team member writes this)
---

# The 10 CTF Challenge Categories, Explained

Every CTF challenge falls into a recognizable category, and knowing what each one actually tests makes it much easier to figure out where to start. Here's a plain-language breakdown of the ten categories you'll see across most platforms, gopwnit included.

## Cryptography

Challenges built around breaking, decoding, or exploiting weaknesses in encryption and encoding schemes. You might be handed an encrypted message and a flawed cipher, or asked to find why a "secure" implementation isn't actually secure. Good starting point if you enjoy math and logic puzzles.

## Forensics

Digging through files, disk images, network captures, or memory dumps to find hidden data. A forensics challenge might hide a flag inside an image's metadata, a deleted file fragment, or a suspicious network packet capture. It rewards patience and knowing your tools (file analysis, steganography detection, packet inspection).

## Reverse Engineering

Taking a compiled program apart to understand what it does — and usually, to find a hidden check or secret value buried in its logic. You'll use disassemblers and debuggers to read machine code and reconstruct the program's behavior without ever seeing its source.

## Binary Exploitation

Sometimes called "pwn," this category is about finding and exploiting memory-safety bugs in a running program — buffer overflows, use-after-free bugs, and similar low-level vulnerabilities — to make it do something it wasn't supposed to, like handing you a flag or a shell.

## Web Exploitation

Finding and exploiting vulnerabilities in websites and web applications: SQL injection, cross-site scripting (XSS), authentication bypasses, and the rest of the OWASP Top 10. It's usually the most approachable category for beginners, since most people already understand how websites work at a basic level.

## OSINT (Open-Source Intelligence)

Piecing together information from publicly available sources — social media, metadata, search engines, public records — to answer a specific question or find a hidden clue. No exploitation involved; it's pure investigative research.

## Miscellaneous

The catch-all category for challenges that don't fit cleanly elsewhere — puzzle logic, unconventional file formats, or genuinely novel problems designed to make you think sideways.

## System / Privilege Escalation

Starting with limited access to a system and finding a path to higher privileges — from a regular user to root or administrator. Tests real system administration knowledge: misconfigurations, weak permissions, and known escalation techniques.

## Mobile

Security challenges specific to mobile applications — reverse-engineering an Android or iOS app, finding insecure data storage, or exploiting a flawed API the app talks to.

## Hardware / IoT

Challenges involving physical or embedded devices — firmware analysis, hardware interfaces, or vulnerabilities specific to Internet-of-Things devices. The least common category at most events, and usually the most specialized.

## Which category should a beginner start with?

Web Exploitation and Forensics tend to be the most approachable — both build on intuitions most people already have (how websites work, how files are structured) rather than requiring low-level systems knowledge up front. Binary Exploitation and Reverse Engineering are usually where beginners hit the steepest learning curve, since they require comfort with how a computer executes code at a fairly low level.

## Frequently asked questions

**Do I need to be good at all ten categories?**
No. Most players specialize in two or three categories they enjoy and build depth there — especially in team competitions, where splitting categories across teammates is the norm.

**Does gopwnit use all ten categories?**
Yes — challenges on gopwnit are organized across all ten, spanning gopwnit's full [beginner-to-advanced learning path](/platform).

**Which category is closest to a real cybersecurity job?**
All of them map to real roles — Web Exploitation to application security, Reverse Engineering and Binary Exploitation to vulnerability research, Forensics to incident response, System/Privilege Escalation to penetration testing. CTFs are good preparation across the board.

---

*See how these categories fit into a structured learning path on the [Platform page](/platform).*
