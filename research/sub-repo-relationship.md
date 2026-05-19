# Sub-Repo Relationship — `bar-portfolio` as Sub-Project #1

Companion to `host-repo-architecture.md`. Earlier docs treated sub-projects as hypothetical future client engagements. This doc addresses the actual first case: **`bar-portfolio` itself is sub-project #1 of the host**. It's already public, already deploying, already has its own knowledge/recipes/prompts/skills folders. So the host repo's job for sub-project #1 is *adoption*, not *creation* — and the patterns for adopting an existing repo into an umbrella are different from greenfield bootstrap.

---

## 1. Why this matters

The architecture assumed sub-projects would be born from the host's templates. But `bar-portfolio` already exists with:

- 4 Vite entries (portfolio, marketing HE, marketing EN, backoffice, lab)
- A four-tier doc system (`knowledge/` + `recipes/` + `prompts/` + `skills/`)
- A working root `CLAUDE.md` with routing table and invariants
- GitHub Pages deploy on push to `main`
- Public visibility

It does **not** need bootstrapping. It needs *integration* — the host needs to know it exists, the relationship needs explicit conventions, and any shared context (voice, principles, CXO knowledge) needs to flow in the right direction without duplication.

The decision the operator faces: when the host repo is created, how does `bar-portfolio` become its first child? Three real-world patterns answer this.

---

## 2. The three real patterns for this exact case

### Pattern A — Virtual Monorepo ([Owen Zanzal, Medium](https://medium.com/devops-ai/the-virtual-monorepo-pattern-how-i-gave-claude-code-full-system-context-across-35-repos-43b310c97db8))

Sibling clone convention. The host and each sub-repo live as **peer directories on disk**:

```
~/code/
├── workshop/           # the host (private)
│   ├── CLAUDE.md       # umbrella context
│   ├── inbox/
│   └── sub-projects/
│       └── bar-portfolio.md   # registry pointer (not the repo)
└── bar-portfolio/      # the actual public repo, untouched
    └── CLAUDE.md       # the existing portfolio CLAUDE.md
```

When Claude works inside `bar-portfolio/`, it walks up to its own `CLAUDE.md` only — host context is **not** auto-loaded because the host isn't an ancestor directory. To get cross-repo context, the operator explicitly opens both folders in the editor, or uses Claude Code's `add-dir` to add the host as a secondary root.

**Pros:** zero coupling, public repo stays cleanly public, no git changes to `bar-portfolio`, scales to N sub-projects without complexity.

**Cons:** context inheritance is opt-in (operator must remember to add the host); no automatic discovery; the host's CXO knowledge doesn't flow into Claude sessions inside `bar-portfolio` unless the operator wires it.

### Pattern B — Spine Pattern ([Titus Soporan](https://tsoporan.com/blog/spine-pattern-multi-repo-ai-development/))

The host acts as a **spine** that holds shared context and per-repo summaries. Sub-repos remain independent but each has a one-page summary inside the host. When Claude is invoked from the host root, it reads the spine and knows about every sub-repo without walking into them.

```
workshop/
├── CLAUDE.md               # umbrella + index
└── spine/
    ├── bar-portfolio.md    # 1-page summary: stack, surfaces, conventions, links
    ├── client-acme.md      # future sub-projects get their own spine entry
    └── ...
```

**Pros:** host has full read-only awareness of every sub-project without needing them on disk; great for "give me a high-level view across everything."

**Cons:** spine summaries drift from reality unless maintained; doesn't help when actually working *inside* a sub-repo.

### Pattern C — Nested CLAUDE.md inheritance ([dev.to: nested CLAUDE.md mechanics](https://dev.to/subprime2010/how-to-use-claude-code-with-multiple-repositories-without-losing-context-4c77))

Claude Code reads one CLAUDE.md per directory level, walking up the tree from cwd to filesystem root. If `bar-portfolio/` lives *inside* the host (as a subdirectory or git submodule), it inherits the host's CLAUDE.md automatically.

```
workshop/
├── CLAUDE.md           # umbrella context, always read
└── projects/
    └── bar-portfolio/  # submodule or subdirectory
        └── CLAUDE.md   # project-specific context, also read
```

**Pros:** automatic inheritance — Claude reads umbrella + project together with no operator effort. The single most powerful Claude-native primitive for this use case.

**Cons:** requires `bar-portfolio` to be physically nested inside the host (as submodule or subdirectory), which complicates the public-private boundary (`bar-portfolio` is public, host is private — they can't share a single git history without leaking).

---

## 3. Recommended hybrid — Spine + Sibling Clone

For this specific case (one private host + one already-public sub-repo + future client engagements that may be private), the recommended pattern is:

**Spine for awareness + Sibling clone for action.**

```
~/code/
├── workshop/                       # private host
│   ├── CLAUDE.md                   # umbrella context, CXO knowledge
│   ├── inbox/
│   ├── spine/                      # per-sub-project summaries
│   │   ├── bar-portfolio.md        # spine summary of the public portfolio
│   │   └── README.md               # how the spine works
│   └── sub-projects/               # context overlays per sub-project
│       └── bar-portfolio/
│           ├── CLAUDE.md           # OVERLAY: things only the host needs to know
│           ├── decisions/          # private decisions about this sub-project
│           └── retros/             # private retros
└── bar-portfolio/                  # public, unchanged
    └── (its own existing structure)
```

The **spine** gives the host awareness ("what is `bar-portfolio`, in one page"). The **sibling clone** lets Claude work inside `bar-portfolio` when needed (with `add-dir workshop` when cross-context is needed). The **sub-projects overlay** in the host holds anything *about* `bar-portfolio` that shouldn't be public — pricing rationale, marketing-effectiveness notes, decisions to deprecate sections, retros from past releases.

This pattern scales naturally to client engagements:
- New private client → new sub-repo (private GitHub) + spine entry + sub-projects overlay
- Public marketing experiment → similar shape, public sub-repo
- A new lab spike → could be a private sub-repo or could live inline in `bar-portfolio` (existing pattern)

---

## 4. What `bar-portfolio` inherits as sub-project #1

When `bar-portfolio` is formally adopted as sub-project #1, the host provides:

**From `workshop/CLAUDE.md` (umbrella):**
- The operator's voice, principles, "build before brief" doctrine
- The CXO roster (when CXOs exist) — CTO conventions, CMO voice rules, etc.
- The rule-of-three discipline, document-at-birth, no-empty-scaffolds
- The capture ↔ retrieve framing for any new knowledge

**From `workshop/sub-projects/bar-portfolio/`:**
- A CLAUDE.md overlay that says "this sub-project is the public portfolio; respect its existing knowledge/ and recipes/ folders; private decisions go here, not there"
- Decision log entries about `bar-portfolio` (e.g., "decided 2026-05 to stop putting client work in public examples")
- Retros from each significant `bar-portfolio` release

**What `bar-portfolio` does NOT inherit:**
- Pricing knowledge (CFO content)
- Lead pipeline state (CRO content)
- Internal operating rituals (COO content)
- Anything client-confidential

This is the **public/private boundary** enforced by the architecture. The umbrella's CXO knowledge stays in the host; `bar-portfolio` reads only what it would have read anyway plus the overlay.

---

## 5. What the host expects FROM `bar-portfolio` (and future sub-projects)

The host expects each sub-project to expose:

1. **A canonical name** (slug used in `spine/<name>.md` and `sub-projects/<name>/`)
2. **An on-disk location** (relative path or absolute, recorded in the registry)
3. **A status** (active / paused / archived)
4. **A one-paragraph "what is this"** in the spine entry
5. **A link to its own CLAUDE.md** so the spine entry can quote/reference it

The umbrella registry (`workshop/spine/README.md` or `workshop/registry.yml`) holds the master index. Adding a new sub-project = adding a spine entry + (optionally) an overlay folder. Removing a sub-project = moving its spine entry to `spine/archive/`.

**Important: no submodules. No copies. No symlinks.** The host references sub-projects by convention (sibling-clone path + spine entry), not by git mechanism. This matches the operator's earlier stance that the architecture shouldn't be locked to git specifics.

---

## 6. The "first sub-repo" bootstrap moment

When the host is born, sub-project #1's adoption is the first real test. The bootstrap sequence:

1. **Host repo is created** (Day 1 walking skeleton — CLAUDE.md, inbox, .claude/)
2. **`spine/` folder is born** the first time a sub-project gets registered (rule of three doesn't apply here — sub-projects are inherently "named things," not patterns)
3. **`spine/bar-portfolio.md` is written** — a one-page summary referencing the public repo's location, surfaces, and existing knowledge structure
4. **`sub-projects/bar-portfolio/CLAUDE.md` overlay is written** — declares what private knowledge about the portfolio lives in the host
5. **First private decision about `bar-portfolio` lands in `sub-projects/bar-portfolio/decisions/0001-*.md`** (e.g., "decided to formalize bar-portfolio as sub-project #1 of the host, 2026-05-19")
6. **Root CLAUDE.md routing table is updated** with one line: `spine/ → per-sub-project summaries`

That's the full adoption. Half a day of work. From then on, every cognitive operation involving `bar-portfolio` that needs private context happens with the host as the working directory; every operation that's purely about the public site happens inside `bar-portfolio` as before.

---

## 7. Lifecycle: when a sub-project is born, evolves, dies

**Birth** (e.g., a new client engagement):
1. Operator drops `WHAT.md` describing the project (Bar's seed from earlier brainstorm)
2. New private repo is created on GitHub (or new subfolder if it never goes public)
3. Spine entry added: `workshop/spine/<name>.md`
4. Overlay folder created: `workshop/sub-projects/<name>/`
5. Bootstrap decision ADR: `sub-projects/<name>/decisions/0001-bootstrap.md`
6. First skill scaffolded if needed: `workshop/sub-projects/<name>/skills/<name>-curator/SKILL.md`

**Active life:**
- Daily/weekly captures about the sub-project land in `workshop/inbox/` first (because inbox is universal), then get triaged into the overlay folder when they cluster
- Public/shippable code lives in the sub-repo
- Private context (pricing, decisions, retros, client preferences) lives in the overlay

**Pause:**
- Spine status changes from `active` to `paused`
- A pause note explains why and what would unfreeze
- No deletion

**Archive:**
- All sub-project context (spine + overlay) moves to `workshop/spine/archive/` and `workshop/sub-projects/archive/`
- A retro is written at archive time
- The sub-repo itself can be archived on GitHub independently

---

## 8. What scales (and what breaks at N sub-projects)

**Scales fine:**
- Spine entries (each is a one-pager; 30 of them is still scannable)
- Overlay folders (each is its own world; they don't interact)
- Inbox capture (no change as N grows)
- Registry (`workshop/registry.yml`) — even 100 entries fit on one screen

**Breaks somewhere between N=5 and N=15:**
- Cross-sub-project pattern recognition (when 3 clients all want similar things, the CKO needs to lift the pattern into umbrella knowledge — this is where Rule of Three earns its keep)
- Spine staleness (per [Owen Zanzal's writeup](https://medium.com/devops-ai/the-virtual-monorepo-pattern-how-i-gave-claude-code-full-system-context-across-35-repos-43b310c97db8) running 35 repos, spine summaries drift; needs a scheduled audit)
- The umbrella CLAUDE.md (if it tries to list every sub-project inline, it bloats past the 200-line cliff)

**The fix at that scale:** introduce the CKO seat to enforce promotion (when 3 sub-projects share a pattern, the pattern moves to the umbrella's `knowledge/`) and to run quarterly audits. This is the moment the CPO-for-agents and CKO seats stop being optional.

---

## 9. Open questions for the operator

1. **Sibling-clone path convention** — `~/code/workshop/` + `~/code/bar-portfolio/`, or something else? The convention should be documented in the host README so future-Bar (or a contractor) knows where things live.
2. **Spine entry template** — what exactly is in `spine/<name>.md`? Suggested fields: name, status, location, stack, surfaces, public/private, last-touched, links to public CLAUDE.md and private overlay. Lock the template at Day 1.
3. **Overlay decisions vs sub-repo decisions** — when a decision affects both the public sub-repo and the private overlay, where does it land? Recommended: always in the overlay; the public repo only sees a commit message.
4. **Does `bar-portfolio` get a banner about being sub-project #1 of a private host?** Probably not — the public site should reveal nothing about the host's existence. Confirm.
5. **When is sub-project #2 (first real client) bootstrapped — when does the lifecycle pattern have to be production-ready?** If the first client is imminent, the bootstrap recipe needs to be tested on `bar-portfolio` first (low-risk dry run).

---

## Sources

- [The "Virtual Monorepo" Pattern — Owen Zanzal, Medium](https://medium.com/devops-ai/the-virtual-monorepo-pattern-how-i-gave-claude-code-full-system-context-across-35-repos-43b310c97db8)
- [The Spine Pattern: Multi-Repo Context for AI-Assisted Development — Titus Soporan](https://tsoporan.com/blog/spine-pattern-multi-repo-ai-development/)
- [Structuring Claude Code for Multi-Repo Workspaces — Karun](https://karun.me/blog/2026/03/26/structuring-claude-code-for-multi-repo-workspaces/)
- [How to use Claude Code with multiple repositories without losing context — dev.to](https://dev.to/subprime2010/how-to-use-claude-code-with-multiple-repositories-without-losing-context-4c77)
- [Multi-Repo Workspace Setup for Claude Code — Raghuveer](https://www.iamraghuveer.com/posts/multi-repo-workspace-claude-code/)
- [What Is Context Inheritance in Claude Code? — MindStudio](https://www.mindstudio.ai/blog/context-inheritance-claude-code-multi-client-projects)
- [Claude Code: one workspace for many repos — ClaudeCodeSessions](https://claudecodesessions.com/claude-code-multi-repo-workspace/)
- [Git Explained: Umbrella Structure with Submodules — dev.to](https://dev.to/milu_franz/git-explained-an-umbrella-structure-using-git-submodules-20dl)
- [Eclipse Xtext's umbrella repository — itemis](https://blogs.itemis.com/en/eclipse-xtexts-new-umbrella-repository)
- [Elixir umbrella projects](https://hexdocs.pm/elixir/main/dependencies-and-umbrella-projects.html)
- [mateodelnorte/meta on GitHub](https://github.com/mateodelnorte/meta)
- [The Meta-Repo Pattern — DevNewsletter](https://devnewsletter.com/p/meta-repo-pattern/)
- [Monorepo vs Multi-Repo — Kinsta](https://kinsta.com/blog/monorepo-vs-multi-repo/)
- [Single Repo to Multi-Monorepo — CSS-Tricks](https://css-tricks.com/from-a-single-repo-to-multi-repos-to-monorepo-to-multi-monorepo/)
