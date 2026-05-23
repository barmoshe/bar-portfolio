---
name: brief-intake
description: Use when a new brief or lead comes in and needs qualifying. Turns a raw, often-vague brief into a structured brief.md plus a short list of clarifying questions. Triggers on /intake, "new lead", "a client wants", or any incoming project request.
license: MIT
---

# brief-intake

Convert a messy incoming brief into something buildable, with the *fewest*
questions. The premise of the business is hours-to-days delivery, so don't
over-interrogate — ask only what changes what you'd build.

## The ~5 questions

1. **What is it, in one sentence?** (the thing they want to exist)
2. **Who is it for, and what's the one job it must do?**
3. **What does "done" look like for v1?** (the single demo-able outcome)
4. **Any hard constraints?** (stack, deadline, brand, data, budget signal)
5. **What happens after the demo?** (their next step — tells you if this is lab,
   lead, or paid)

## Output — `brief.md`

```md
# <project> — brief
- One-liner:
- For / job-to-be-done:
- v1 "done":
- Constraints:
- After-demo intent:
- Open questions: (anything still unanswered)
```

Keep `brief.md` immutable once written; track changes as decisions, not edits.
Only ask follow-ups that would change the build. If the brief is already clear,
write it and skip the questions.
