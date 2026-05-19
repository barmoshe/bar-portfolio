# Client Sub-Project Lifecycle — A Reference for the Solo-Developer Workshop

Companion to `host-repo-architecture.md` and `sub-repo-relationship.md`. A research synthesis for operators running multiple client engagements out of one host repo, where each engagement is a physical sub-project repo and the host carries the private overlay (decisions, retros, pricing rationale, comms log).

---

## 1. The complete lifecycle map

A client sub-project moves through six named stages, with a hard gate between each. The gates are documents or signatures, not feelings.

| # | Stage | Entry gate | Exit gate | Typical duration |
|---|---|---|---|---|
| 0 | **Lead** | First inbound contact | Signed mutual NDA + intake form complete | 24–48h |
| 1 | **Qualification** | NDA signed | Disqualified OR signed Discovery agreement | 3–5 days |
| 2 | **Discovery / POC** | Discovery SOW signed (paid) | POC demo + `exit-criteria.md` reviewed | 1–6 weeks (Shape Up "appetite") |
| 3 | **Paid Pilot** | Pilot SOW signed | Pilot acceptance memo | 4–12 weeks |
| 4 | **Retainer** | MSA + monthly retainer SOW signed | 30-day notice OR scope-down | Indefinite (3–24m typical) |
| 5 | **Archive** | Notice received | Handover doc signed + data-deletion attestation | 2–4 weeks wind-down |

**Non-negotiable principle from Shape Up:** every stage has a **fixed time budget** and a **variable scope**, never the reverse. *"Appetite is how much time and effort the team is willing to invest (typically 2 or 6 weeks), rather than an estimate of how long the work will take."* ([Shape Up — Set Boundaries](https://basecamp.com/shapeup/1.2-chapter-03)) Stages don't slip; scope does.

**Pilot-to-Paid (P2P) literature backs this empirically:** *"Structured pilots with clear success criteria, defined timelines, paid engagement, and pre-negotiated conversion terms converted at 68%. Free pilots with vague metrics and no conversion planning converted at 23%."* ([Monetizely — Enterprise Pilot Pricing](https://www.getmonetizely.com/articles/how-to-structure-enterprise-pilot-program-pricing-effective-proof-of-concept-strategies); [Guru Startups — Pilot-to-Paid Conversion Rate](https://www.gurustartups.com/reports/pilot-to-paid-conversion-rate))

---

## 2. Stage 1 — Lead arrives: first 48 hours

The intake window is short and almost entirely about filtering. thoughtbot's published process is the simplest reference: *"Prospect contacts thoughtbot → complete new project form → phone call or office visit → **mutual qualification: is thoughtbot a good fit? is client a good fit?** → understand client's vision → agree on target outcomes."* ([thoughtbot Playbook extracted](https://github.com/daryllxd/lifelong-learning/blob/master/consulting/thoughtbot-playbook.md)) The two-way framing — "is the client a good fit for *us*" — is what most solo devs skip.

**Intake form** (first response, auto-reply if possible). BANT is still the workhorse: Budget, Authority, Need, Timeline. *"It works best when used conversationally, not as a rigid form."* ([Salesforce — What is BANT](https://www.salesforce.com/blog/sales/what-is-bant-lead-generation/); [Pangea — BANT 2025](https://pangeaglobalservices.com/bant-in-action-practical-tips-for-qualifying-leads/)) For a solo dev, a 6-field web form covering BANT + a "what does success look like in 90 days" question is enough.

**NDA timing.** Sign a mutual NDA *before* sensitive info is shared, but *not* before the intro call exists. *"An NDA is a standalone document signed before discussions begin to protect information during the pre-contract phase… while a confidentiality clause is part of a larger contract."* ([Consulting Quest — NDAs, MSAs, SOWs 2025](https://consultingquest.com/insights/consulting-contracts-nda-msa-sow/)) Hartley Brody's counter-view: a pre-meeting NDA where you know nothing is legally meaningless (consideration problem) and a soft red flag. ([Brody — 7 Reasons](https://blog.hartleybrody.com/wont-sign-nda/)) Practical rule: NDA goes out *after* the 30-min intro call, *before* the technical deep-dive.

**When to disqualify in the first 48h.** Delicious Brains' "Project Red Flags for the Solo Dev": *"A client who casually mentions being on their fourth developer that year… a client demanding a complex, custom-built site with a shoestring budget and impossible deadlines… clients dismissing the need for user guides, style documents, or maintenance checklists."* ([Delicious Brains](https://deliciousbrains.com/project-red-flags-for-the-solo-dev/)) Monetizely adds: decline pilots when *"the customer is clearly fishing for free consulting rather than evaluation, competitive dynamics suggest they're favoring another vendor and checking a box, or multiple previous pilots failed to convert."*

**Files produced** (`clients/<slug>/00-intake/`): `intake.md` (BANT answers), `nda-mutual-signed.pdf`, `intro-call-notes.md`, `qualification-decision.md` (go/no-go with one paragraph of reasoning).

---

## 3. Stage 2 — Discovery & POC kickoff

This is where solo devs most often donate weeks of free work and call it "spec'ing the project." The Shape Up principle is the antidote: **fixed time, variable scope**, with the pitch as the contract artifact.

**The Shape Up pitch as POC kickoff doc** — exactly five elements: *"**Problem** — the raw idea or use case. **Appetite** — how much time we want to spend and how that constrains the solution. **Solution** — core elements in a form easy to immediately understand. **Rabbit holes** — details worth calling out to avoid problems. **No-gos** — anything specifically excluded."* ([Shape Up — Write the Pitch](https://basecamp.com/shapeup/1.5-chapter-06)) Small batches are *"one or two weeks each"*; full bets are *"six weeks."* ([Shape Up — Betting Table](https://basecamp.com/shapeup/2.2-chapter-08))

**Paid discovery, not free.** [Lunch Pail Labs](https://lunchpaillabs.com/blog/paid-discovery-experiment): *"Clients invest in a one-week sprint that delivers something tangible, like a prototype or roadmap. If they choose to move forward, the discovery fee is credited towards the larger project."* [Rocking Tech](https://rockingtech.co.uk/products/discovery-sprint) publishes a "Platform Discovery Sprint from £4,500." [USDS publishes a full open-source discovery sprint guide](https://sprint.usds.gov/). The structural move: the discovery *is the POC*, it's paid, and the fee is creditable against a follow-on pilot.

**`exit-criteria.md` — the most important file in this stage.** A POC without exit criteria becomes a perpetual unpaid prototype. The file lists, in checklist form, *exactly* what the demo must show for the engagement to graduate to pilot. Borrow MADR's "Decision Drivers" + "Confirmation" structure ([MADR template](https://github.com/adr/madr/blob/master/template/adr-template.md)): each criterion has a measurable signal and a named decision-maker. Typical contents: (a) which user flow must work end-to-end, (b) what data scale it must handle, (c) which integration is wired, (d) the named go/no-go meeting date.

**The POC folder** (`clients/<slug>/02-poc/`): `pitch.md` (Shape Up format), `appetite.md` (the time budget), `exit-criteria.md`, `discovery-sow-signed.pdf`, `demo-script.md`, `assumptions.md` (every "I'm assuming X" call-out), `rabbit-holes.md`, `out-of-scope.md` (the no-gos, durable across the engagement).

**Stage gate to leave Stage 2:** demo delivered, exit-criteria.md checked off (or explicitly waived in writing), named conversion meeting on the calendar.

---

## 4. Stage 3 — POC → Paid pilot conversion

**The trip-wire rule** is the single most important boundary for a solo developer: *no free work past week 3.* Phrased as policy in the host repo:

> **If the POC has not been converted to a signed Paid Pilot SOW by end of week 3, all work pauses until SOW is countersigned.**

Consistent with Brennan Dunn ("the ideal time to propose a retainer is after completing a successful project" — [Double Your Freelancing retainer guide](https://doubleyourfreelancing.com/freelancers-guide-client-retainer-agreements/)) and Jonathan Stark's *"stop trading time for money"* framing — hourly work past a discovery window structurally encourages scope creep. ([Stark — Hourly Billing Is Nuts](https://jonathanstark.com/hbin); [Conquer Local interview](https://www.conquerlocal.com/podcast/transitioning-from-hourly-billing-to-effective-pricing-models/))

**What changes legally.** Discovery SOW is small, narrow, references a Statement of Work directly. Pilot SOW is the first time you should have a Master Services Agreement (MSA) underneath: *"An NDA is signed before discussions begin… a confidentiality clause is part of a larger contract (like a Consulting Agreement)."* ([Consulting Quest](https://consultingquest.com/insights/consulting-contracts-nda-msa-sow/)) Standard 2025 progression: **NDA → discovery SOW → MSA + pilot SOW**, where the MSA carries the durable terms (IP, liability cap, payment terms, governing law, indemnity) and each pilot/retainer SOW becomes a short scope exhibit underneath.

**What changes operationally.** The [Index.dev 2025 freelance dev contract template](https://www.index.dev/blog/freelance-software-developer-contract-template) lists what should appear in the pilot SOW: scope, deliverables, milestones, payment schedule, IP assignment (typically transferring on payment — thoughtbot's old contract: *"client owns the week's source code once they've paid"*), confidentiality, termination, dispute resolution.

**Pricing — 2026 ranges** (multiple converging sources on independent/boutique dev consultant rates):

- Hourly: $150–$300/hr for experienced consultants, $300–$500+/hr for niche experts ([Invoicebloom 2026](https://invoicebloom.io/blog/how-much-to-charge-as-consultant); [NMS](https://nmsconsulting.com/consulting-fees-and-pricing-in-2026/))
- Day rate: 6–8× hourly rate
- Pilot pricing as % of annual contract: *"10–30% of annual contract value for the pilot, with 100% of the pilot fee credited toward the full contract if the customer converts"* ([Monetizely](https://www.getmonetizely.com/articles/how-to-structure-enterprise-pilot-program-pricing-effective-proof-of-concept-strategies))
- Monthly retainer: boutique $2k–$8k, mid-tier $5k–$15k, high-impact $5k–$20k+ ([Consulting Success](https://www.consultingsuccess.com/consulting-retainer))
- Retainer discount vs hourly: 10–15% (Invoicebloom)

The pilot itself is typically priced flat-fee against `exit-criteria.md`, not hourly — this is where Jonathan Stark's value-pricing kicks in.

**Files produced** (`clients/<slug>/03-pilot/`): `msa-signed.pdf`, `pilot-sow-signed.pdf`, `pricing-rationale.md` (the *why* of the number — for your future self, not the client), `acceptance-criteria.md`, `change-request-template.md`.

---

## 5. Stage 4 — Pilot → Retainer conversion (the Stark/Dunn pattern)

Brennan Dunn calls this *"selling current, future, and past clients on hiring you on an ongoing basis"* — get the first project, prove value, *"convert them to outcome-focused retainers for recurring revenue, then productize."* ([Double Your Freelancing](https://doubleyourfreelancing.com/freelancers-guide-client-retainer-agreements/)) Jonathan Stark's complementary insight: *"Retainer engagements naturally taper in value over time as big strategic decisions are made, the client moves into implementation and maintenance, eventually ending on its own, with new clients coming in at a higher rate."* ([Lifestarr Podcast](https://www.lifestarr.com/podcast/the-pricing-strategy-that-doubled-this-solopreneurs-income-in-year-one))

**When the transition is right** (synthesized from Consulting Success + Expert CFO):

1. Pilot acceptance criteria were met *and* there's an obvious next 90-day block of work.
2. Client has shown payment discipline (net-15 or net-30 honored in the pilot).
3. There is one *named* decision-maker on the client side who will own the relationship.
4. You can predict 60–80% of the work for the next month; the rest is buffer.
5. The client wants predictability more than they want elasticity.

([Consulting Success](https://www.consultingsuccess.com/consulting-retainer); [Expert CFO](https://theexpertcfo.com/switching-to-retainer-work/))

**SLA structure.** A retainer needs three numbers the pilot didn't: (a) committed hours/days per month (the floor), (b) response SLA for new requests (e.g. *"ack within 1 business day, plan within 3"*), (c) escalation path for production incidents. Atlassian's incident response model is the reference for the third: *"blameless postmortem, root cause via the 5 Whys, corrective actions turned into Jira work items with owners and deadlines."* ([Atlassian Postmortem Templates](https://www.atlassian.com/incident-management/postmortem/templates); [Atlassian Blameless Postmortem](https://www.atlassian.com/incident-management/postmortem/blameless))

**Contract upgrade.** MSA stays; new "Retainer SOW" replaces Pilot SOW with monthly auto-renew, 30-day mutual termination, explicit *carry-over* and *use-it-or-lose-it* rules on unused hours.

**Files produced** (`clients/<slug>/04-retainer/`): `retainer-sow-signed.pdf`, `sla.md`, `escalation.md`, `oncall-rotation.md` (even if it's just you), `monthly-invoice-template.md`.

---

## 6. Stage 5 — Ongoing retainer: weekly cadence

The thoughtbot cadence is the most-cited public model and maps cleanly onto a solo operator:

> *"**Daily Standup** (10 minutes, 10 AM) — yesterday's work, today's plan, blockers. **Weekly Retrospective** (30 minutes, Mondays, in-person) — celebrate successes, identify and address improvement areas. **Planning Meeting** (30 minutes, Thursdays) — assess client satisfaction. Saying 'no' means keeping the software we're building as simple as possible."* ([thoughtbot Playbook](https://github.com/daryllxd/lifelong-learning/blob/master/consulting/thoughtbot-playbook.md); [thoughtbot — Meet Weekly](https://thoughtbot.com/playbook/planning/meet-weekly-to-discuss-successes-failures-and-plans))

The Monday retro question, used verbatim by thoughtbot: ***"How did you feel about last week? How do you feel coming into this week?"*** — *"less a recap of completed work and more a pulse of how each person feels."* Their billing rhythm: *"Weekly invoicing (Saturdays for prior week)"* with *"Net 15 payment terms"* and *"first two weeks payment required upfront."*

**For a solo dev**, collapse to:

- **Monday 15-min async retro** (written in `clients/<slug>/04-retainer/retros/YYYY-WW.md`, shared with client)
- **Thursday 30-min planning call** — pick next week's bet, confirm priorities
- **Weekly invoice** dispatched Saturday for the prior week (Net 15)
- **Monthly P&L + metrics review** (private, in `clients/<slug>/decisions/`) — the [Garry Tan GStack](https://github.com/garrytan/gstack) model surfaces this: *"operating reviews including monthly P&L, monthly metrics, and monthly retro are recommended practices."*

**ADRs as the durable decision log.** Use MADR 4.0.0 format — each ADR file has: `status`, `date`, `decision-makers`, `consulted`, `informed`, `Context and Problem Statement`, `Decision Drivers`, `Considered Options`, `Decision Outcome` (with `Consequences` + `Confirmation` sub-sections), `Pros and Cons of the Options`, `More Information`. ([MADR template](https://github.com/adr/madr/blob/master/template/adr-template.md)) Folder convention: *"`docs/adr/` with `nnnn-title.md`, zero-padded for sorting."* ([joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record))

**Solo-dev twist:** *technical* ADRs in the client's own sub-project repo (delivered IP); *engagement* ADRs (pricing changes, scope refusals, retro outcomes) in the host repo under `clients/<slug>/decisions/`.

**Per-engagement folder during retainer** (`clients/<slug>/04-retainer/`):

- `retros/YYYY-WW.md` — Monday pulse, 4Ls or Start/Stop/Continue
- `plans/YYYY-WW.md` — Thursday plan, current Shape Up bet
- `invoices/YYYY-MM.pdf` + `time-log.md`
- `decisions/NNNN-*.md` — MADR ADRs for engagement-level calls
- `comms/YYYY-MM/` — exported email/Slack threads, chronological
- `incidents/YYYY-MM-DD-*.md` — Atlassian-style postmortems for prod breakage

**Retro template choice.** [Atlassian's 4Ls](https://www.atlassian.com/team-playbook/plays/4-ls-retrospective-technique) — *"Loved, Loathed, Longed for, Learned"* — works for project-end. [Start/Stop/Continue](https://www.atlassian.com/software/confluence/templates/start-stop-continue) (*"10 minutes each on start, stop, and continue"*) works for weekly. [Parabol's 50+ post-mortem question bank](https://www.parabol.co/resources/post-mortem-questions/) is the deeper reservoir when the standard template feels stale.

---

## 7. Stage 6 — Archive: the clean exit

A clean exit has three artifacts and one legal action.

**Artifact 1: Handover document.** The seven-thing rubric from offboarding literature: *"a role overview, ongoing projects, recurring tasks, key contacts, access and tools, institutional knowledge, and open questions."* ([Scribe — Handover Document Template](https://scribe.com/library/handover-document-template); [Smartsheet — Software Project Handover Template](https://www.smartsheet.com/sites/default/files/2022-06/IC-Software-Project-Handover-Document-11458_PDF.pdf)) For a dev sub-project: `HANDOVER.md` in the client's own repo covering runbook, env vars (referenced, never inlined), deploy procedure, third-party accounts and who owns each, known issues, decisions log pointer.

**Artifact 2: Project-end retro.** Atlassian-style blameless: *"every team and employee acted with the best intentions based on the information they had at the time… focus on improving performance moving forward."* ([Atlassian — Blameless](https://www.atlassian.com/incident-management/postmortem/blameless)) The retro feeds *two* places: a client-facing version (politer, action-items only) in the comms log, and a private studio-learning version in the host repo under `playbook/learnings/` — this is the loop back into the host playbook.

**Artifact 3: Archive manifest.** A single `ARCHIVE.md` in `clients/<slug>/archive/` listing every system that held client data, what was deleted, what was retained, and on what legal basis.

**Legal action — GDPR / Israel Amendment 13 split.** This is the most-overlooked part of solo-dev offboarding. EU GDPR principle: *"Remove personal data from operational systems to reduce privacy risk and limit processing. If you have legal retention obligations or need to defend claims, you may be allowed to retain a minimal set of information in a tightly restricted archive, with clear purpose, strict access, and defined retention and deletion."* ([Docbyte — GDPR Delete vs Archive](https://www.docbyte.com/gdpr-delete-retain-archive/))

Israel's **Amendment 13 to the Protection of Privacy Law**, effective **August 14, 2025**, tightens this further: *"Database controllers are obligated to delete data unlawfully obtained or no longer necessary for the purposes for which they were collected, and must implement mechanisms to ensure that the database does not retain data that are no longer necessary."* ([IAPP — Israel Amendment 13](https://iapp.org/news/a/israel-marks-a-new-era-in-privacy-law-amendment-13-ushers-in-sweeping-reform); [BigID — Amendment 13](https://bigid.com/blog/what-israel-amendment-13-means-for-businesses-in-2025/); [Safetica](https://www.safetica.com/resources/guides/israel-s-amendment-13-what-the-new-data-protection-law-means-for-your-business)) Penalties scale: *"fines reaching millions of shekels, with multipliers for large-scale databases or sensitive data processing."*

**The deletion vs studio-learning split — concrete rule:**

- **Delete from operational systems within 30 days of contract end**: customer PII, credentials, exported DB snapshots, anything containing third-party personal data, anything the MSA's confidentiality clause specifically names.
- **Retain in restricted host-repo archive** (with a documented legal basis): redacted ADRs, anonymized retros, pricing rationale, scope-creep stories, postmortems with names scrubbed. These feed the studio brain. Tag them `lesson:` and strip identifying nouns.
- **Send a data-deletion attestation** to the client within 30 days of exit. The artifact that both protects you and earns referrals.

---

## 8. The per-client folder structure

Proposed layout for `clients/<slug>/` in the host repo. Each subfolder maps to a stage; `decisions/`, `retros/`, `comms/`, `access/`, and `archive/` are cross-cutting.

```
clients/<slug>/
├── README.md                  # 1-screen client summary: status, contacts, links, current bet
├── 00-intake/
│   ├── intake.md              # BANT answers
│   ├── nda-mutual-signed.pdf
│   ├── intro-call-notes.md
│   └── qualification-decision.md
├── 01-discovery/
│   ├── discovery-sow-signed.pdf
│   ├── interview-notes.md
│   └── findings.md
├── 02-poc/
│   ├── pitch.md               # Shape Up: Problem/Appetite/Solution/Rabbit holes/No-gos
│   ├── appetite.md
│   ├── exit-criteria.md       # measurable demo gates
│   ├── demo-script.md
│   └── out-of-scope.md
├── 03-pilot/
│   ├── msa-signed.pdf
│   ├── pilot-sow-signed.pdf
│   ├── pricing-rationale.md   # private; the why of the number
│   ├── acceptance-criteria.md
│   └── change-requests/
├── 04-retainer/
│   ├── retainer-sow-signed.pdf
│   ├── sla.md
│   ├── escalation.md
│   ├── retros/YYYY-WW.md
│   ├── plans/YYYY-WW.md
│   ├── invoices/YYYY-MM.pdf
│   └── incidents/YYYY-MM-DD-*.md
├── decisions/                 # MADR-format engagement ADRs (cross-stage)
│   └── 0001-*.md
├── comms/                     # exported threads, chronological
│   └── YYYY-MM/
├── access/                    # references only, never secrets
│   ├── systems.md             # what they gave me access to
│   └── credentials-vault.md   # pointer to 1Password vault id, never the secrets
└── archive/
    ├── HANDOVER.md
    ├── final-retro.md         # client-facing
    ├── lessons.md             # private, fed back to host playbook
    └── ARCHIVE.md             # data-deletion manifest + attestation copy
```

**Per-stage required files** (gate-blocking — engagement cannot advance without them):

- Lead → Discovery: `intake.md`, `nda-mutual-signed.pdf`, `qualification-decision.md`
- Discovery → POC: `discovery-sow-signed.pdf`, `findings.md`
- POC → Pilot: `pitch.md`, `exit-criteria.md` (checked off), `pricing-rationale.md`
- Pilot → Retainer: `pilot-sow-signed.pdf`, accepted acceptance memo, `msa-signed.pdf`
- Retainer → Archive: `HANDOVER.md`, `final-retro.md`, `ARCHIVE.md` with deletion attestation

This structure intentionally separates **deliverable IP** (lives in the *client's* sub-project repo: code, technical ADRs, runbooks) from **engagement context** (lives in the host repo under `clients/<slug>/`: pricing, retros, comms, lessons). The thoughtbot model of *"contract storage in Dropbox with folders for pending, current, past, and lost clients"* is the same separation, less formalized.

---

## 9. Anti-patterns from real practice

1. **The Perpetual Pilot.** *"Some customers become trapped in perpetual pilot mode, showing enthusiasm but never building the internal momentum needed for real adoption."* ([Monetizely](https://www.getmonetizely.com/articles/how-to-structure-enterprise-pilot-program-pricing-effective-proof-of-concept-strategies)) Fix: the week-3 trip-wire and a written conversion meeting date in `exit-criteria.md`.

2. **The Free-POC Death Spiral.** *"Completely free pilots lack executive attention and drift without conclusion."* (Monetizely) Fix: every POC is paid discovery, even if priced low; the fee is creditable on conversion.

3. **The Stealth Scope Creep.** *"Neither the consultant nor the client take steps to manage scope creep, partially because changes start on a barely noticeable scale and then increase over time… by week three, a consultant found herself reviewing supplier contracts, sitting in on procurement meetings, and drafting a transport tender document when originally engaged just to audit warehouse operations."* ([Consulting Business School](https://www.consultingbusinessschool.com/3-tips-to-manage-scope-creep-client-projects/)) Fix: `out-of-scope.md` is a living file; every refusal is logged.

4. **The Fourth-Developer-This-Year Client.** *"A client who casually mentions being on their fourth developer that year hints at unstable expectations or a history of conflict."* ([Delicious Brains](https://deliciousbrains.com/project-red-flags-for-the-solo-dev/)) Fix: ask the question in the intake call, log the answer in `qualification-decision.md`.

5. **The Hourly Trap.** *"Hourly billing is a backwards pricing strategy that creates an artificial ceiling on pricing and income while also creating trust fractures in client relationships and encouraging scope creep."* ([Stark — Hourly Billing Is Nuts](https://jonathanstark.com/hbin)) Fix: pilot is flat-fee against `exit-criteria.md`; retainer is monthly flat, not hourly.

6. **The Backup-That-Wasn't-Deleted.** *"A recent Microsoft 365 governance assessment showed how easily ex-employee OneDrive retention can persist, even with the 2025 enforcement changes and modern Microsoft 365 retention controls in place."* ([ISACA — Former Employee Data 2025](https://www.isaca.org/resources/news-and-trends/industry-news/2025/secure-management-of-former-employee-data-a-practical-approach)) Fix: `ARCHIVE.md` enumerates every system; deletion attestation is mandatory.

7. **The NDA-Before-the-Coffee.** A pre-meeting NDA with no consideration is meaningless and a soft red flag. ([Brody](https://blog.hartleybrody.com/wont-sign-nda/)) Fix: NDA after intro call, never before.

8. **The Lost Decision Trail.** Solo devs frequently make architectural calls in Slack DMs that no one can reconstruct six months later. ADRs solve this: *"one decision per ADR, immutability — don't alter existing info; amend or supersede instead."* ([joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record)) Fix: MADR template, numbered, in `decisions/`.

---

## 10. Open questions for the operator

1. **What's the canonical `<slug>` rule?** First 8 chars of company legal name, or codenames so a leak of the host repo's directory listing doesn't reveal the client roster? Affects every path in section 8.
2. **Where does the MSA live — once per client, or once per studio?** A reusable studio-side MSA (signed once per client) plus per-engagement SOW exhibits is the standard pattern, but requires legal review of one document the operator may not have yet.
3. **What's the explicit pricing-tier ladder?** 2026 ranges span 4–5×; the operator needs a published rate card (even if internal) that says "discovery = $X flat, pilot = $Y flat per week of appetite, retainer floor = $Z/month" — without this, every pricing conversation re-litigates.
4. **What's the host repo's secret-handling rule?** The structure says "credentials vault references only, never secrets" — but does the operator commit to a scanner (GStack's *"defense-in-depth secret scanner that blocks AWS keys, tokens, PEM blocks, and JWTs before they leave your machine"* — [GStack](https://github.com/garrytan/gstack)) in pre-commit, or rely on discipline?
5. **What's the retention period for the "lessons" archive under Amendment 13?** The legal basis for keeping anonymized retros is "legitimate interest in studio learning" — but the operator needs a written, dated retention policy (e.g. *"anonymized lessons retained 5 years, full retros deleted at exit + 30 days"*) to defend that basis if the Israeli PPA asks.

---

## Sources

**Engagement playbooks**
- [thoughtbot Playbook (extracted)](https://github.com/daryllxd/lifelong-learning/blob/master/consulting/thoughtbot-playbook.md) · [thoughtbot — Meet Weekly](https://thoughtbot.com/playbook/planning/meet-weekly-to-discuss-successes-failures-and-plans)
- [Consulting Success — SOW Template](https://www.consultingsuccess.com/consulting-statement-of-work-template) · [Consulting Success — Retainer Guide](https://www.consultingsuccess.com/consulting-retainer)
- [The Expert CFO — Switching to Retainer Work](https://theexpertcfo.com/switching-to-retainer-work/)
- [Brennan Dunn — Freelancer's Guide to Retainers](https://doubleyourfreelancing.com/freelancers-guide-client-retainer-agreements/)
- [Jonathan Stark — Hourly Billing Is Nuts](https://jonathanstark.com/hbin) · [Stark on Lifestarr Podcast](https://www.lifestarr.com/podcast/the-pricing-strategy-that-doubled-this-solopreneurs-income-in-year-one) · [Stark on Conquer Local](https://www.conquerlocal.com/podcast/transitioning-from-hourly-billing-to-effective-pricing-models/)

**Shape Up**
- [Write the Pitch](https://basecamp.com/shapeup/1.5-chapter-06) · [Set Boundaries](https://basecamp.com/shapeup/1.2-chapter-03) · [The Betting Table](https://basecamp.com/shapeup/2.2-chapter-08) · [Place Your Bets](https://basecamp.com/shapeup/2.3-chapter-09)

**ADRs**
- [adr.github.io](https://adr.github.io/) · [MADR template](https://github.com/adr/madr/blob/master/template/adr-template.md) · [joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record) · [AWS Prescriptive Guidance — ADR Process](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/adr-process.html)

**Contracts & SOWs**
- [Index.dev — Freelance Developer Contract Template](https://www.index.dev/blog/freelance-software-developer-contract-template)
- [Consulting Quest — NDAs, MSAs, SOWs 2025](https://consultingquest.com/insights/consulting-contracts-nda-msa-sow/)
- [Hartley Brody — 7 Reasons I Won't Sign Your NDA](https://blog.hartleybrody.com/wont-sign-nda/)
- [10x Management — Sample SOW for Freelance Projects](https://10xmanagement.com/a-great-sample-scope-of-work-sow-for-freelance-projects/)

**POC / Pilot conversion**
- [Monetizely — Enterprise Pilot Pricing](https://www.getmonetizely.com/articles/how-to-structure-enterprise-pilot-program-pricing-effective-proof-of-concept-strategies) · [Guru Startups — Pilot-to-Paid Conversion Rate](https://www.gurustartups.com/reports/pilot-to-paid-conversion-rate) · [Heavybit — SaaS POC & Paid Pilot](https://www.heavybit.com/library/article/saas-poc-paid-pilot-program) · [Lunch Pail Labs — Paid Discovery](https://lunchpaillabs.com/blog/paid-discovery-experiment) · [USDS — Discovery Sprint Guide](https://sprint.usds.gov/) · [Rocking Tech — Discovery Sprint](https://rockingtech.co.uk/products/discovery-sprint)

**Pricing 2026**
- [Invoicebloom — Consulting Rates 2026](https://invoicebloom.io/blog/how-much-to-charge-as-consultant) · [NMS — Consulting Fees 2026](https://nmsconsulting.com/consulting-fees-and-pricing-in-2026/) · [Data-Mania — Consulting Rate Card 2026](https://www.data-mania.com/blog/consulting-rate-card-2026-templates-pricing-menu/) · [ConsultFees — Retainers 2026](https://consultfees.com/blog/consulting-retainers)

**Retros & postmortems**
- [Atlassian — Postmortem Templates](https://www.atlassian.com/incident-management/postmortem/templates) · [Atlassian — Blameless Postmortem](https://www.atlassian.com/incident-management/postmortem/blameless) · [Atlassian — 4Ls](https://www.atlassian.com/team-playbook/plays/4-ls-retrospective-technique) · [Atlassian — Start/Stop/Continue](https://www.atlassian.com/software/confluence/templates/start-stop-continue)
- [Parabol — Post-Mortem Templates](https://www.parabol.co/resources/post-mortem-templates/) · [Parabol — 50+ Post-Mortem Questions](https://www.parabol.co/resources/post-mortem-questions/)

**Lead qualification**
- [Salesforce — What is BANT](https://www.salesforce.com/blog/sales/what-is-bant-lead-generation/) · [Pangea — BANT 2025](https://pangeaglobalservices.com/bant-in-action-practical-tips-for-qualifying-leads/) · [Sybill — BANT 2025](https://www.sybill.ai/blogs/bant-qualification)
- [HoneyBook — Successful Client Kickoff](https://www.honeybook.com/blog/successful-client-kickoff-call) · [HoneyBook — Onboarding Checklist](https://www.honeybook.com/blog/client-onboarding-checklist-guide) · [Floowi — Onboarding Checklist](https://floowitalent.com/a-smart-onboarding-checklist-for-new-clients/)

**Anti-patterns**
- [Delicious Brains — Project Red Flags](https://deliciousbrains.com/project-red-flags-for-the-solo-dev/) · [Consulting Business School — Scope Creep](https://www.consultingbusinessschool.com/3-tips-to-manage-scope-creep-client-projects/) · [Hypersense — Scope Creep 2025](https://hypersense-software.com/blog/2025/05/30/scope-creep-management-software-development/)

**Offboarding & privacy**
- [Scribe — Handover Document Template](https://scribe.com/library/handover-document-template) · [Smartsheet — Software Project Handover](https://www.smartsheet.com/sites/default/files/2022-06/IC-Software-Project-Handover-Document-11458_PDF.pdf) · [ManyRequests — Client Offboarding Checklist](https://www.manyrequests.com/templates/client-offboarding-checklist)
- [Docbyte — GDPR Delete vs Archive](https://www.docbyte.com/gdpr-delete-retain-archive/) · [ProBackup — GDPR Deletion & Backups](https://www.probackup.io/blog/gdpr-and-backups-how-to-handle-deletion-requests) · [4Spot — GDPR Offboarding Automation](https://4spotconsulting.com/automating-gdpr-data-erasure-for-compliant-offboarding/) · [ISACA 2025 — Former Employee Data](https://www.isaca.org/resources/news-and-trends/industry-news/2025/secure-management-of-former-employee-data-a-practical-approach)
- [IAPP — Israel Amendment 13](https://iapp.org/news/a/israel-marks-a-new-era-in-privacy-law-amendment-13-ushers-in-sweeping-reform) · [BigID — Amendment 13](https://bigid.com/blog/what-israel-amendment-13-means-for-businesses-in-2025/) · [Safetica — Amendment 13 Explained](https://www.safetica.com/resources/guides/israel-s-amendment-13-what-the-new-data-protection-law-means-for-your-business) · [ICLG — Israel Data Protection 2025-2026](https://iclg.com/practice-areas/data-protection-laws-and-regulations/israel)

**Solo-dev infra**
- [Garry Tan — GStack](https://github.com/garrytan/gstack)
