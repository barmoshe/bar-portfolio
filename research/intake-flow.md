# Mock Flow — Marketing Site → WhatsApp → Sub-Project Creation

A walkthrough of what happens between a stranger filling out the intake on `/business/` and a new client sub-project existing in the Workshop. Written as **what is known at each touchpoint** — not as a pipeline diagram. Each section asks: *what does the system know now? what doesn't it know yet? what artifacts exist? what decisions are pending?*

Includes weighted options for the integration choices the operator has to make.

> Walkthrough uses an invented but realistic lead: **"Yossi, 12-seat dental clinic in Petah Tikva, wants online booking + WhatsApp confirmations."**

---

## Touchpoint 0 — Yossi lands on `/business/en/`

**What the system knows now:** nothing about Yossi. Possibly a referrer URL (Google, LinkedIn, direct), possibly a UTM parameter from an ad, the browser language. That's it.

**What it doesn't know:** who Yossi is, what he wants, whether he's serious, whether he's the decision-maker, whether he can pay.

**Artifacts that exist:** none in the Workshop. Possibly a hit in whatever analytics is running on the marketing site (currently none on bar-portfolio — by design).

**Decisions pending:** none. The system is passive until Yossi acts.

**Open design question:** is the marketing site instrumented to capture *anything* before intake submission (heat-map, scroll depth, time-on-page)? Currently no — the bar-portfolio repo has zero tracking by design. The Workshop will know about Yossi only when he sends a brief.

---

## Touchpoint 1 — Yossi fills the intake on `/business/`

The bar-portfolio marketing site uses a chat-style Quest Dialogue intake ([recent commit history](https://github.com/barmoshe/bar-portfolio): `feat(business): adopt new section order and Quest Dialogue intake`). Three required fields — project type, idea, contact — plus template-specific follow-ups.

For Yossi, the intake produces a structured brief: project type = "MVP" or "Web", idea = "online booking for my clinic + WhatsApp reminders for appointments", contact = a phone number.

**What the system knows now (added to Touchpoint 0):**
- Project type (one of 10 catalog options)
- Free-text idea (Yossi's words, 1–3 sentences)
- A WhatsApp-capable phone number
- Whatever else the template-specific questions captured (e.g. budget range, timeline)
- Timestamp of submission

**What it still doesn't know:**
- Yossi's name (the intake form may or may not ask for it — currently it doesn't)
- Whether Yossi is the decision-maker or just researching
- Budget (unless the template asked)
- Whether the clinic actually exists (versus "I'm thinking of opening one")
- Existing tech (Calendly? Paper book? Custom system?)
- Whether "WhatsApp reminders" requires WhatsApp Business API (cost implications)

**Artifacts that exist:** still nothing in the Workshop. The intake submission becomes a WhatsApp message (next touchpoint), but nothing has landed in the repo yet.

**Decisions pending:** none yet — Bar hasn't seen the message.

---

## Touchpoint 2 — Bar's WhatsApp pings

The intake form's submission action is "open WhatsApp with a pre-filled message to Bar's number." Yossi taps **Send** on his own device, in his own WhatsApp. Bar's phone vibrates.

The message looks something like (composite of what the Quest Dialogue produces):

> *Hi Bar, my name is Yossi. I run a 12-seat dental clinic in Petah Tikva. I want online booking + automatic WhatsApp reminders to patients before appointments. Budget around ILS 5,000. Timeline ASAP — patients are calling all day and I'm losing them. Sent from bar-moshe.com/business.*

**What the system knows now (the Workshop, specifically, still nothing — but Bar's WhatsApp knows):**
- All of Touchpoint 1's facts
- The exact phrasing Yossi used (much richer than a form's structured fields)
- The time of day Yossi sent it (often a signal — 2am suggests stress; 10am Tuesday suggests deliberate)
- That Yossi typed in Hebrew or English (signal about preferred working language)
- WhatsApp's display name and profile picture for Yossi's number (signal about how legitimate this is)

**What it still doesn't know:**
- Whether this is the first message of a real engagement or a casual probe
- Whether Yossi will reply if Bar asks a clarifying question
- Whether "ILS 5,000" is the project budget or a monthly subscription budget (ambiguous)
- What Yossi's actual urgency means — "patients calling all day" could mean 500 calls/day or 20

**Artifacts that exist:** a single message thread in Bar's WhatsApp. The Workshop still has nothing.

**Decisions pending (all on Bar):**
1. Is this lead worth Bar's attention? (Disqualify, qualify, or wait.)
2. Reply now from the phone, or open a Claude session to draft a reply?
3. Capture into the Workshop now, or after a back-and-forth?

---

## Touchpoint 3 — The WhatsApp message reaches the Workshop

**This is the most important integration decision in the whole flow.** Getting Yossi's message from WhatsApp into the Workshop's inbox is the seam where the marketing world meets the operator's brain. Five real options, weighted.

### Option A — Manual copy-paste (no integration)

Bar opens a Claude session in the Workshop, runs `/triage`, and pastes the WhatsApp message text by hand. Claude writes the inbox entry.

| Dimension | Weight |
|---|---|
| Setup time | **Zero.** Works on Day 1. |
| Cost | **$0** ongoing. |
| Latency | Whenever Bar gets to it. |
| Privacy | **Maximum** — nothing leaves Bar's phone except via Bar's hand. |
| Reliability | Depends on Bar remembering to do it. **Single biggest risk: forgotten leads.** |
| Reversibility | Total — abandon at any time. |
| When to pick | Day 1 through ~5 leads/week. The default. |

### Option B — WhatsApp Web export → drop file in `inbox/`

Bar uses WhatsApp Web to export a single chat to a `.txt` file, drops the file in `Workshop/inbox/raw/whatsapp/`, then runs `/triage` which reads and extracts. Same loop as Option A but with a file artifact.

| Dimension | Weight |
|---|---|
| Setup time | ~30 min (workflow muscle memory) |
| Cost | $0 |
| Latency | Same as Option A |
| Privacy | High (exports stay local) |
| Reliability | Same as Option A, but the file is a durable receipt |
| Reversibility | Total |
| When to pick | Once 2–3 leads have been captured manually and the pattern emerges. The "Rule of Three" upgrade from A. |

### Option C — WhatsApp MCP server (Claude reads WhatsApp directly)

A WhatsApp MCP server connects Claude Code directly to a linked WhatsApp Web session. Real implementations exist as of 2025–26:
- [verygoodplugins/whatsapp-mcp](https://github.com/verygoodplugins/whatsapp-mcp) — Python MCP server + Go bridge
- [Rich627/whatsapp-claude-plugin](https://github.com/Rich627/whatsapp-claude-plugin) — linked-device pattern, no API keys, no Docker
- [Composio WhatsApp MCP](https://composio.dev/toolkits/whatsapp/framework/claude-code) — managed via Composio's tool router
- [whatsapp-cli on Shyft](https://shyft.ai/skills/whatsapp-cli)

| Dimension | Weight |
|---|---|
| Setup time | 1–4 hours (install + first-link friction) |
| Cost | $0 (linked-device patterns) to ~$10/mo (Composio) |
| Latency | Near-real-time (Claude pulls on demand) |
| Privacy | Medium — depends on implementation. Linked-device approach keeps messages local; cloud-hosted MCPs route through a third party. |
| Reliability | Medium — depends on WhatsApp Web staying linked; reconnect friction is real |
| Reversibility | Disconnect anytime; messages stay in WhatsApp |
| When to pick | When the manual copy-paste becomes the lead-volume bottleneck (~10+ leads/week) |

### Option D — WhatsApp Business API via gateway (Twilio, Wati, WasenderAPI)

The full B2B path. WhatsApp messages route through a Business API gateway → webhook → custom endpoint → writes to the Workshop's `inbox/`. Gateways compared:

| Gateway | Pricing model | Strength | Weakness |
|---|---|---|---|
| **Twilio** | Meta base + $0.005–0.010/msg ([Chatarmin on Twilio WhatsApp](https://chatarmin.com/en/blog/twilio-whats-app-api)) | Most flexible, best docs | Most engineering required (build your own dashboard) |
| **Wati** | Flat monthly + per-msg | No-code, made for non-tech teams ([Wappbiz comparison](https://www.wappbiz.com/blogs/twilio-alternatives/)) | Less flexible; vendor lock-in |
| **WasenderAPI** | $6/month, unlimited messages | Cheapest, REST API | Smaller vendor, less proven |
| **Wappbiz / DoubleTick** | Streamlined SMB pricing | CRM-style features built in | Designed for sales teams, not solo dev |

Meta changed pricing in July 2025: utility templates within the 24-hour window are free; marketing templates always cost money.

| Dimension | Weight |
|---|---|
| Setup time | 1–3 days (API approval, gateway choice, webhook wiring) |
| Cost | $6–$100+/mo depending on gateway and volume |
| Latency | Real-time |
| Privacy | **Low** — messages route through a third-party gateway by design |
| Reliability | High once stable; setup friction is the killer |
| Reversibility | Medium — undoing the gateway and Meta approval is a chore |
| When to pick | When Bar is sending *outbound* WhatsApp at scale (marketing campaigns, automated confirmations) AND lead volume justifies it. Probably never for pure intake. |

### Option E — Click-to-chat ads + Meta-managed funnel (the 2026 default for marketers)

The pattern most current marketing literature advocates: replace the form entirely with a Meta ad that opens WhatsApp directly. [Chatarmin](https://chatarmin.com/en/blog/whats-app-marketing-leads): *"In 2026, nobody voluntarily fills out a web form on their phone anymore. User sees your Meta ad, clicks it, and lands directly in the WhatsApp chat. No landing page, no form, no friction."*

This isn't an alternative for *capturing into the Workshop* — it's an alternative for *the entire marketing site approach*. Listed for completeness but probably not aligned with bar-portfolio's deliberate "marketing site as portfolio surface" stance.

| Dimension | Weight |
|---|---|
| Setup time | Days (Meta ad account, click-to-chat configuration) |
| Cost | Whatever ad spend is — could be $0 if you skip ads |
| Latency | N/A (different layer) |
| Privacy | Meta sees the funnel |
| Reliability | High |
| When to pick | Only if bar-portfolio's marketing strategy shifts away from "ship the portfolio, intake follows" — out of scope for the Workshop design |

### Recommended trajectory

**Day 1 — Option A.** Copy-paste. No engineering. Forces the loop to be useful before it's automated.

**~Week 4 (after 3–5 captured leads) — Option B.** Add the WhatsApp Web export drop convention. Now there's a file artifact in `inbox/raw/whatsapp/`.

**~Month 3 (if lead volume sustains ≥5/week) — Option C.** Add a WhatsApp MCP, probably Rich627's linked-device plugin (no API keys, no Docker, matches the operator's "lean" stance). Skip Composio unless other Composio toolkits also become valuable.

**Never (probably) — Option D.** Business API gateways are over-engineered for inbound-only solo use; only worth it if outbound automation becomes the bottleneck.

**Out of scope — Option E.** Different strategic question.

---

## Touchpoint 4 — Inbox entry exists in the Workshop

Regardless of which option from Touchpoint 3 was used, the result is a dated note in `Workshop/inbox/2026-05-19-yossi-clinic.md` (or similar — exact slug TBD).

The first time Claude triages, it writes something like (composite of `remember-md/remember` schema + the operator's preference for free-form):

```markdown
---
date: 2026-05-19
source: whatsapp
type: lead
freshness: fresh
confidence: 0.6
---

Yossi, dental clinic in Petah Tikva, 12 seats.
Wants: online booking + WhatsApp appointment reminders.
Budget mentioned: ILS 5,000 (unclear: project or monthly).
Timeline: "ASAP — patients calling all day."
Phone: +972-XX-XXX-XXXX.

Raw message: [paste of original]

Open questions:
- Is ILS 5,000 the project budget or monthly?
- Is Yossi the owner/decision-maker, or office manager?
- What's the current booking method (paper / Calendly / custom)?
- Does "WhatsApp reminders" require the WhatsApp Business API (cost implication)?
- Patient volume — appointments/day?
```

**What the system knows now:**
- All of Touchpoint 2's facts, persisted in markdown
- Bar's first-read interpretation (the structured summary)
- The explicit open-questions list (this is the most valuable output of triage)
- Inbox cardinality bumped by 1 (which the SessionStart hook will surface tomorrow)

**What it still doesn't know:**
- All the things in the open-questions list
- Whether this lead will ever reach Stage 1 (Qualification) or just sit in the inbox until aged out

**Artifacts that exist:**
- The inbox note above
- Nothing else — no `clients/yossi/` folder, no NDA, no decision yet

**Decisions pending:**
1. Reply to Yossi now (with clarifying questions) or wait until Bar has more context?
2. Schedule a 30-min intro call, or handle async?
3. Disqualify on the spot (e.g. if the clinic-WhatsApp-reminders combo requires regulated medical-data handling Bar doesn't want to take on)?

This is the **first real moment the Workshop is the source of truth.** From here on, the WhatsApp thread is the *raw source*; the inbox note (and what it becomes) is the *canonical record*.

---

## Touchpoint 5 — Bar replies to Yossi (clarifying questions)

Bar opens WhatsApp, types a reply drawing on the open-questions list. Probably something like: *"Hi Yossi — sounds doable. Three quick questions before I quote: (1) Is 5,000 ILS for the build, or are you thinking monthly? (2) Are you the clinic owner or are we coordinating with someone else? (3) Do you currently use any booking system, or is it phone + paper?"*

Yossi replies (an hour, a day, or never — this is the first real signal).

**What the system knows now after Yossi replies:**
- Yossi's answers (which may resolve some open questions, raise others)
- The *speed* of Yossi's reply — a 12-minute reply is a different signal than a 6-day reply
- The *tone* of Yossi's reply — short and crisp vs verbose and rambling

**Artifacts that should now exist** (Bar runs `/triage` again, or appends to the same inbox note):
- An updated inbox note with the new facts
- A `BANT` slot in the note now populated: Budget (more specific), Authority (confirmed), Need (confirmed), Timeline (confirmed)
- A scoring nudge — informally, Bar starts to feel "this is a yes" or "this is a no"

**Lead-scoring research suggests** explicit tiers per [Default.com inbound lead qualification guide](https://www.default.com/post/inbound-lead-qualification): *"Score tiers to start with: 65+ is high, 35–64 is medium, and under 35 is low, then adjust after the first 30 days when you have real data to calibrate."* Bar doesn't have a scoring system on Day 1; he has gut feel. The Rule of Three says: after the 3rd lead, write down the scoring rubric.

**Decisions pending:**
1. Qualify → schedule intro call.
2. Disqualify → write polite "this isn't a fit" in `qualification-decision.md`, reply to Yossi, archive the inbox note.
3. Defer → put on a "follow up in 2 weeks" tickler.

---

## Touchpoint 6 — Qualification decision

Bar makes the call. Two paths.

### Path A — Disqualify

Bar writes a one-paragraph `qualification-decision.md` and replies to Yossi. The inbox note moves to `Workshop/inbox/archive/`. The system has captured: who Yossi was, what he wanted, why Bar said no. That archive feeds future pattern recognition (CKO's job: "are we declining the same kind of lead repeatedly? maybe we should be saying yes — or putting it on the public no-list").

**What survives:** the archived inbox note + qualification-decision. **What doesn't:** any further engagement with Yossi.

### Path B — Qualify → next stage

Bar replies to Yossi, schedules a 30-min intro call. **This is the moment the lead earns a `clients/<slug>/` folder.** The slug is chosen here (open question from the architecture: codename vs name — see `client-lifecycle.md` open question #1).

The inbox note gets *promoted* — moved into `clients/yossi-clinic/00-intake/intake.md` (or copied + archived, depending on the operator's preference). The `00-intake/` folder is created with `qualification-decision.md` (set to "qualified, advancing to discovery"), `intake.md` (the structured version of the inbox note), and a stub `intro-call-notes.md` waiting to be filled.

**What the system knows now:**
- A named client exists in the Workshop
- The client's facts are now in a structured folder, not just the inbox
- The intake stage gate is "in progress"
- The next required artifacts (NDA, intro call) are blocking the next stage gate

**What it still doesn't know:**
- Anything from the intro call (hasn't happened yet)
- Whether Yossi will sign the NDA
- Whether the discovery SOW pricing will land

**Decisions pending:**
1. Send NDA now or after the intro call? (Per `client-lifecycle.md` recommendation: after the call, before any deep technical sharing.)
2. Codename or real name as `<slug>`? (Open question from architecture.)
3. Does the eventual sub-project (when created) get a private or public GitHub repo? (Determined by Yossi's preference + contract terms.)

---

## Touchpoint 7 — Intro call happens

A 30-minute call. Bar takes notes during or right after. The notes land in `clients/yossi-clinic/00-intake/intro-call-notes.md`.

**What the system knows now (added):**
- Yossi's tone in conversation (very different signal than text)
- Whether there are unspoken concerns (e.g. budget anxiety, prior bad dev experience)
- Specific technical hints (existing tools, integrations needed)
- Yossi's actual decision-making process (does he need to "check with my partner"?)
- Whether Bar wants to work with Yossi (the gut-feel signal that text never gives)

**Artifacts:** `intro-call-notes.md` populated. Possibly a calendar event for the follow-up. NDA sent (or queued).

**Decisions pending:**
1. Send NDA + Discovery SOW?
2. Or one more synchronous check-in (e.g. Bar wants to see the existing booking process before quoting)?

---

## Touchpoint 8 — NDA signed, Discovery SOW signed

Yossi signs both (via DocuSign, PandaDoc, or Bar's chosen e-sign tool). PDFs land in `clients/yossi-clinic/00-intake/nda-mutual-signed.pdf` and `clients/yossi-clinic/01-discovery/discovery-sow-signed.pdf`.

**What the system knows now (added):**
- Legal protection is in place
- Yossi has actually paid (or committed to pay) for the first slice of work
- The engagement is no longer "free consulting"
- The stage clock has started — discovery has a defined appetite (e.g. 1 week paid)

**Decisions pending:**
1. Is this also the moment to spin up the sub-project repo, or does that wait until POC?

This question is real. Two options:

### Sub-project repo: created at Discovery vs. at POC

| Option | Pro | Con |
|---|---|---|
| **At Discovery** | Code-flavored discovery (rapid prototyping) is the most common case for Bar's stack; having a repo ready means no friction the moment a code-shaped artifact emerges | Some discoveries don't produce code; the repo can sit empty and feel like commitment |
| **At POC** | Repo exists only when there's something to put in it; cleaner correspondence between "we're building" and "the repo exists" | Brief delay when the first code-shaped moment arrives; risk of starting in scratch space and never migrating |

**Recommendation:** create the sub-project repo at **POC**, not Discovery. Discovery should be deliberately code-free (interviews, sketches, findings.md). If code emerges during Discovery, that's a signal Discovery has bled into POC and the SOW should be re-scoped.

---

## Touchpoint 9 — Sub-project repo is created

POC SOW signed. Bar creates a new GitHub repo (private, named per the slug convention) and clones it as a sibling of the Workshop:

```
~/code/
├── workshop/                    # private host
│   └── clients/yossi-clinic/    # context overlay
└── yossi-clinic/                # NEW: the actual sub-project repo
    ├── README.md                # 1-paragraph "what this is"
    ├── CLAUDE.md                # sub-project-specific Claude context
    └── (code emerges here)
```

The Workshop's `clients/yossi-clinic/02-poc/` gets the `pitch.md` (Shape Up format), `appetite.md`, `exit-criteria.md`. The sub-project repo is born empty except for the README and a CLAUDE.md that points back to the Workshop overlay.

The host repo's `registry/sub-projects.yml` (or `spine/` per `sub-repo-relationship.md`) gets a new entry: `yossi-clinic` with status `poc`, location `../yossi-clinic`, public/private flag, links to its CLAUDE.md.

**What the system knows now (added):**
- A real sub-project exists, physically (folder, git remote, possibly first commit)
- The Workshop's overlay knows about it (registry entry)
- The exit-criteria for the POC are written down
- A demo date is implicitly or explicitly on the calendar

**What it still doesn't know:**
- Whether the POC will succeed against exit-criteria
- Whether Yossi will pay for the pilot when the POC graduates
- Whether code-level surprises will reshape the architecture mid-POC

**Decisions pending:**
1. First-commit ritual — does Bar create a starter CLAUDE.md from the Workshop's `templates/sub-project/`?
2. Does the sub-project inherit any host-level conventions automatically (via nested CLAUDE.md, sibling-clone discovery, or explicit copy)?

This is where the Workshop and the sub-project repo become truly entangled. Everything the operator does in `yossi-clinic/` from now on is mediated by the Workshop's umbrella context (when a Claude session opens both folders) but stored in the sub-project's own git history.

---

## What this walkthrough surfaces

Re-reading the touchpoints, the system accumulates knowledge in **layers**, not in a sequence:

1. **Yossi's words** (raw — WhatsApp message)
2. **Bar's first-read structured summary** (inbox note)
3. **Clarification answers** (back-and-forth in WhatsApp, captured into the note)
4. **Bar's qualification gut-call** (`qualification-decision.md`)
5. **Synchronous-only facts** (`intro-call-notes.md` — tone, unspoken concerns)
6. **Legal scaffolding** (NDA, SOW PDFs)
7. **Operational scaffolding** (sub-project repo + registry entry)

Each layer should be **append-only** with respect to the layer below it — Bar should never edit Yossi's raw message; he should write *interpretations of* it in higher layers. This is the Karpathy LLM-wiki pattern from the brain-deep-dive: `raw/` is immutable, the wiki is the LLM-maintained synthesis. ([MindStudio on Karpathy's pattern](https://www.mindstudio.ai/blog/karpathy-llm-wiki-knowledge-base-pattern))

It also surfaces three concrete things the Workshop architecture needs (none of which is built yet):

1. **An `inbox/raw/` subfolder convention** for original-message captures, separate from the LLM-synthesized notes.
2. **An `intake/` skill** (more specific than `triage`) that handles the WhatsApp-message-shaped capture and prompts for the standard open-questions checklist.
3. **A promotion ritual** that turns an inbox note into a `clients/<slug>/` folder with the right starter files — this is the "promote" skill, scoped to client engagements.

---

## Open questions for the operator (specific to this flow)

1. **Slug rule.** Real names (`yossi-clinic`) or codenames (`patient-zero`)? If the host repo's directory listing ever leaks, real names reveal the client roster.
2. **WhatsApp integration trigger.** What's the explicit threshold for moving from Option A (manual) to Option C (MCP)? Suggested: "when 3 leads in 7 days come in faster than I can triage."
3. **Reply latency norm.** Is Bar committing to a public SLA on reply speed (e.g. "within 24h business hours")? If yes, the inbox note should carry an `expires` field that the SessionStart hook surfaces.
4. **First-touch question template.** Is the open-questions list in the inbox note standardized (BANT + a few extras), or generated case-by-case? Standardizing is faster but blunter.
5. **Disqualify reply template.** Does Bar maintain a polite-no template? The literature suggests yes — same words every time, no drift.
6. **NDA timing.** Per the lifecycle doc: NDA after intro call, before deep technical sharing. Does Bar want a written rule in `cro/` saying "no PDFs of internal systems before signed NDA"?
7. **Sub-project repo creation moment.** Confirmed at POC, not Discovery — but does Bar want a `/spawn-sub-project` skill that scaffolds the repo + Workshop overlay + spine entry in one command?

---

## Sources

**WhatsApp intake & lead generation**
- [Chatarmin — WhatsApp Marketing Leads 2026](https://chatarmin.com/en/blog/whats-app-marketing-leads)
- [Flowcart — WhatsApp Lead Generation 2026](https://www.flowcart.ai/blog/whatsapp-lead-generation)
- [Uptail — WhatsApp Lead Generation Strategy](https://www.uptail.ai/blog/whatsapp-lead-generation-strategy-how-to-turn-conversations-into-pipeline)
- [YCloud — WhatsApp Lead Generation Strategies](https://www.ycloud.com/blog/whatsapp-lead-generation-strategies)
- [AiSensy — WhatsApp Lead Generation Funnel 2026](https://m.aisensy.com/blog/how-to-build-a-whatsapp-lead-generation-funnel/)
- [Typebot — WhatsApp Lead Generation Strategies that Convert 2026](https://typebot.com/blog/whatsapp-lead-generation)

**Lead qualification & MQL handoff**
- [New Breed — Proven MQL Handoff Workflow](https://www.newbreedrevenue.com/blog/marketing-qualified-lead-handoff-012)
- [Default.com — Inbound Lead Qualification](https://www.default.com/post/inbound-lead-qualification)
- [Copy.ai — Inbound Lead Qualification Process](https://www.copy.ai/blog/inbound-lead-qualification-process)
- [Datalane — Qualifying a Lead 2026](https://www.datalane.com/post/qualifying-a-lead)
- [Lyzr — AI Agents for Lead Qualification](https://www.lyzr.ai/blog/ai-agents-for-lead-qualification/)
- [Growth Rocket — Lead Qualification Frameworks](https://www.growth-rocket.com/blog/from-chaos-to-clarity-improving-lead-qualification-frameworks-step-by-step/)
- [Medium — Lead Qualification Automation Workflow for Agencies](https://medium.com/@AlexTheSmartExplorer/a-simple-lead-qualification-automation-workflow-for-agencies-step-by-step-33028267c7c6)

**WhatsApp MCP servers & Claude integration**
- [verygoodplugins/whatsapp-mcp on GitHub](https://github.com/verygoodplugins/whatsapp-mcp)
- [Rich627/whatsapp-claude-plugin on GitHub](https://github.com/Rich627/whatsapp-claude-plugin)
- [Composio WhatsApp MCP for Claude Code](https://composio.dev/toolkits/whatsapp/framework/claude-code)
- [whatsapp-cli — Shyft](https://shyft.ai/skills/whatsapp-cli)
- [Apidog — WhatsApp MCP & Apidog Integration](https://apidog.com/blog/whatsapp-mcp-server/)
- [MSApps-Mobile/claude-plugins WhatsApp-MCP](https://github.com/MSApps-Mobile/claude-plugins/blob/main/plugins/whatsapp-mcp/README.md)
- [Medium — Claude AI WhatsApp MCP Integration Guide](https://medium.com/@honeyricky1m3/claude-ai-whatsapp-mcpintegration-discover-the-essential-guide-to-connect-them-598f9a84630b)

**WhatsApp Business API gateways (option D)**
- [Chatarmin — Twilio WhatsApp API Pricing 2026](https://chatarmin.com/en/blog/twilio-whats-app-api)
- [Wappbiz — Top 10 Twilio Alternatives](https://www.wappbiz.com/blogs/twilio-alternatives/)
- [WasenderAPI — Cheap Twilio Alternative](https://www.wasenderapi.com/blog/twilio-cheap-alternative-low-cost-whatsapp-api-options-in-2025)
- [Lemin AI — Best WhatsApp Business API Alternatives for Small Businesses](https://leminai.com/best-whatsapp-business-api-alternatives-for-small-businesses/)
- [Engagelab — WhatsApp Business API Pricing 2026 Guide](https://www.engagelab.com/blog/whatsapp-business-api-pricing)
- [YCloud — Top Twilio Alternatives](https://www.ycloud.com/blog/top-twilio-alternatives-and-competitors)
- [Trengo — Best WhatsApp Business API Providers 2026](https://trengo.com/blog/whatsapp-business-api-partners)
- [Wappbiz — Top WhatsApp Business API Providers 2026](https://www.wappbiz.com/blogs/whatsapp-business-api-provider/)

**Related Workshop docs**
- [host-repo-architecture.md](./host-repo-architecture.md)
- [client-lifecycle.md](./client-lifecycle.md)
- [sub-repo-relationship.md](./sub-repo-relationship.md)
- [brain-deep-dive.md](./brain-deep-dive.md) (Karpathy LLM-wiki pattern — `raw/` immutable, `wiki/` LLM-maintained)
