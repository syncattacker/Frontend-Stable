# Blog content drafts

Staging folder for articles planned in the Phase 3 content engine — **not** deployed code, not picked up by Next.js routing. Review each `.md` file, then publish it yourself through the dashboard's blog creator (`/dashboard/blogs/creator`) so you stay in control of what actually goes live and who it's credited to.

Each file has frontmatter (`title`, `slug`, `category`, `description`) matching the fields the CMS actually asks for, plus a `suggested_author` placeholder — assign it to whichever real team member (or contributor) is publishing, since bylines are part of the E-E-A-T system now wired into `/blog/authors/[username]`.

**Format note:** these are plain Markdown. TipTap's editor doesn't auto-parse `##`/`**` syntax from a plain-text paste, so headings/bold/lists need a quick manual reformat pass after pasting — a few minutes per article, not a rewrite.

## Status

- [x] `01-ctf-101/` — 5 articles (What is a CTF, scoring, formats, categories, first-event guide)
- [x] `02-learning-paths/` — 5 articles (career roadmap, Linux, networking, OWASP Top 10, CTF-to-pentester)
- [x] `03-hosting-guides/` — 5 articles (how to host, budget, challenge design, buy vs. build, corporate CTFs)
- [ ] `04-event-recaps/` — **deliberately skipped.** GLAU Mock CTF and Pentest Showdown recaps need real specifics (winners, standout challenges, participant moments) that weren't available. Revisit once that detail exists — a thin, fact-only recap wasn't worth writing.

15 of the planned 20 articles are done. Publish these first; add event recaps later once there's real material for them.
