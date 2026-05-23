# The Workshop Repo — Vision & Intent

*(Working title only — name is undecided. Earlier "Gita/Geeta" was voice-to-text for "GitHub", not a chosen name. Research leaned toward "Workshop / סדנה"; not locked.)*

This is a **vision / intent capture**, not a design. The goal is to record what
Bar wants and why. No architecture, no v1 file layout, no build — those come in
a later session, with more research. Extracted via a short interview (May 2026).

---

## Context — why now

Bar is starting a **new business**, and wants to set up its home repo *correctly
from the start* so that it can become the single source of truth that Claude
(and other AI agents) load into context every time. Get the foundation right
now, and later layer "advanced and innovative AI/agent tools" on top to automate
the work.

The brainstorm phase is done (the other 12 docs in `research/`). The intent is
to make it real — but deliberately starting from the **vision**, not the wiring.

---

## What the business is

Still being figured out, but the shape is clear:

- Bar is a **builder** — uses AI tools to build basically anything, fast.
- The offer: a client gives a **small brief**, Bar maybe asks a few minor
  clarifying questions, and **within hours-to-days they receive their MVP / POC.**
- It's a **launchpad / breeding ground** for both **non-technical and technical
  people** to take their next step — their next AI thing, their company, their
  portfolio, etc.
- "The first MVP is no sweat for me" — that low effort-per-build is the whole
  premise that makes the model work.

## How it relates to the existing surfaces

- **The Lab (`/lab`)** → the *start*: gets free first customers, runs as the
  experiment that seeds the business.
- **The Business (`/business`)** → currently just the marketing website; **this
  is what moves into the new repo** and becomes the real, paid operation.
- **The Portfolio (`bar-portfolio`)** → **stays exactly where it is, fully
  separate.** Not absorbed, not touched.

So the new repo is the home of **the business**, fed by the lab, with the
portfolio living its own independent life.

## How sub-projects live inside it

The repo **hosts sub-projects**, and improves over time as they accumulate:

- When starting a **new** project → create a **folder inside the business repo**
  for it.
- When it's an **existing** project (e.g. an unfinished GitHub repo a client
  hands over) → **clone it in**.
- There may be other cases too — the model isn't fully nailed, but the instinct
  is: **projects live *inside* the workshop**, not just referenced from afar.

Sub-projects are: client projects, Bar's own side/"cell phone" projects, and
projects to improve the business itself.

---

## The core operating principle

**Every action in this project gets done by Claude or another AI agent.**
That's how Bar works — he directs AI *smartly and dynamically*, telling it what
to do rather than doing it by hand. So the repo isn't a filing cabinet to
maintain; it's a **substrate built to be operated by agents.**

What exactly Claude does, which tools/skills it gets, which flows trigger —
**all deliberately deferred.** Not deciding that now; it needs its own research.

---

## What "done correctly" / success looks like

Not fully certain yet, but the felt sense of success:

- A **knowledge base that improves over time** rather than going stale.
- It **hosts the sub-projects** worked on, each accumulating its own context.
- Claude can **load the business into context** and act like it actually runs
  with Bar — less re-explaining.
- It's **still alive** — not another abandoned Notion graveyard.

---

## v1 ambition

**Bare walking skeleton.** Smallest real thing on disk, grown from there. The
*shape* of that skeleton is **intentionally left for a later session** — this
doc is vision only.

---

## Explicitly deferred (NOT deciding now)

- Concrete v1 file/folder layout.
- The intake/lead flow & any automation (WhatsApp, email, forms) — discuss only
  abstractly for now.
- What Claude specifically does; which tools, skills, hooks, sub-agents, flows.
- The CXO seats / org-layer idea from the research.
- Whether sub-projects are folders-in-repo vs separate-repos-referenced (leaning
  folders/clones-inside, but not final).
- The name.

## Open questions for a future session

1. What's the minimum the repo needs at the start to be *useful before it's
   automated*?
2. The exact sub-project hosting model (folders/clones inside vs referenced) and
   how cloned client repos coexist with the workshop's own git history.
3. How the **lab → business** handoff works (free build → paid relationship).
4. Which of the research's governing ideas (start-tiny / one-inbox / lean
   context / agent-operated) to adopt as the spine — revisit when it's concrete,
   not abstract.
5. The name.
