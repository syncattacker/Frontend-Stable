---
title: "Linux Basics for Hacking: What You Actually Need to Know"
slug: linux-basics-for-hacking
category: Learning Path
description: You don't need to master Linux to start hacking — you need a specific, practical subset. Here's exactly what that subset is and why it matters.
suggested_author: (assign to whichever team member writes this)
---

# Linux Basics for Hacking: What You Actually Need to Know

Nearly every security tool you'll ever use, and most servers you'll ever attack or defend, run on Linux. That's the entire reason it's the first thing on every cybersecurity roadmap — not tradition, just practicality. The good news: you don't need to become a Linux system administrator to get started. You need a specific, fairly small set of skills.

## Why Linux specifically?

Windows and macOS are built for general-purpose use, with a lot hidden behind graphical interfaces. Linux — especially security-focused distributions like Kali Linux or Parrot OS — exposes the system directly through the terminal, and comes with the security tooling ecosystem pre-installed or trivially installable. Every major CTF platform, penetration testing methodology, and security certification assumes terminal comfort.

## Get a Linux environment running

You have three practical options:

1. **A dedicated Linux virtual machine** (VirtualBox or VMware, running Kali Linux or a similar distro) — the most common setup, and the most flexible for experimenting.
2. **WSL (Windows Subsystem for Linux)** if you're on Windows and don't want a full VM — good enough for most beginner-to-intermediate work, though some low-level tooling behaves differently.
3. **A dual-boot setup** — more commitment, best once you're sure this is a path you're sticking with.

Start with a VM. It's disposable, safe to break, and easy to reset if you mess something up — which you will, and that's fine.

## The commands that actually matter early on

You don't need to memorize hundreds of commands. This short list covers the vast majority of early CTF and lab work:

- **Navigation:** `ls`, `cd`, `pwd`, `find` — moving around and locating files.
- **File inspection:** `cat`, `less`, `file`, `grep` — reading and searching file contents.
- **Permissions:** `chmod`, `chown`, `ls -la` — understanding who can do what to a file, which underpins a huge number of privilege escalation challenges.
- **Networking:** `curl`, `wget`, `netcat` (`nc`), `ping` — talking to remote systems.
- **Process and system info:** `ps`, `top`, `whoami`, `id`, `uname -a` — understanding what's running and what privileges you currently have.
- **Text processing:** `grep`, `awk`, `sed`, `cut` — pulling specific information out of large amounts of text output, which happens constantly.

## The concept that trips up most beginners: permissions

Linux's permission model (read/write/execute, for owner/group/others) is genuinely central to a huge share of CTF challenges, especially in the System / Privilege Escalation category. Understanding *why* a file with the wrong permissions is a security problem — not just *how* to read the permission string — is worth spending real time on before moving further.

## Package managers and installing tools

Most security tools are either pre-installed on security-focused distros or a package manager command away (`apt install <tool>` on Debian-based systems like Kali). Get comfortable installing, updating, and occasionally troubleshooting a broken package install — it's a small but constant part of the workflow.

## What you don't need to worry about yet

You don't need to memorize every `bash` scripting construct, understand the Linux kernel internals, or be able to compile your own kernel. Those are advanced-and-optional, not foundational. If a tutorial insists you need to master shell scripting before touching your first CTF challenge, that's overkill for where you're starting.

## Frequently asked questions

**Do I need to fully switch to Linux as my daily operating system?**
No. A VM or WSL alongside your normal OS is completely sufficient for learning and most CTF work.

**Which distro should I use — Kali or Parrot?**
Both are solid, security-focused, and come with similar tooling pre-installed. The difference matters far less than actually spending time in the terminal. Pick one and move on.

**How much Linux do I need before trying my first CTF challenge?**
Enough to navigate the filesystem, read files, and run a basic command with arguments. That's a few hours of practice, not weeks.

---

*Put these basics to work in [gopwnit's structured labs](/platform), built to layer on top of exactly this foundation.*
