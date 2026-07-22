# How to set up Claude Code with this context

## 1. Place the files

Put these at the root of your `flippo` project:

```
flippo/
  CLAUDE.md              ← always loaded by Claude Code every session
  docs/
    PRODUCT.md           ← read on demand (product spec)
    ARCHITECTURE.md      ← read on demand (technical HLD/LLD)
    ROADMAP.md           ← read on demand (phased plan + checklists)
```

The full engineering plan artifact you already have can also live in `docs/`
as `PLAN.md` if you want the long-form reference alongside these.

## 2. Install Claude Code (if you haven't)

In your terminal, from anywhere:

```bash
npm install -g @anthropic-ai/claude-code
```

Then from inside the `flippo` folder:

```bash
cd ~/Developer/flippo    # wherever your project is
claude
```

Follow the login prompt the first time.

> Verify the current install command and requirements at docs.claude.com — the
> package name or setup may have changed since these notes were written.

## 3. First-session prompts (copy/paste these in order)

### Prompt A — orient it
```
Read CLAUDE.md, then docs/PRODUCT.md, docs/ARCHITECTURE.md, and docs/ROADMAP.md.
Summarize back to me in a few sentences: what we're building, our current
status, and what the very next task is. Don't write any code yet.
```

### Prompt B — confirm working style
```
Before we build: I'm new to TypeScript and this is a learning project, so
explain types and patterns in plain language as we go, work in small verifiable
steps, and after each change tell me how to run and verify it. If you're about
to add a dependency or make an architectural choice, explain the why and let me
confirm first. Acknowledge and then propose a plan for our next task from the
roadmap.
```

### Prompt C — start the actual work
```
Let's do the next unchecked item in docs/ROADMAP.md. Outline your plan first,
wait for my okay, then implement it in small steps. When we finish, update the
checkboxes in ROADMAP.md and the status list in CLAUDE.md.
```

## 4. Keep the memory fresh (ongoing habit)

- At the **end of a work session**, ask:
  ```
  Update the status checklist in CLAUDE.md and docs/ROADMAP.md to reflect what
  we finished today. Add any important decisions we made to the right doc.
  ```
- When a decision changes (new library, changed approach), have it update
  `docs/ARCHITECTURE.md` so the memory never drifts from reality.
- Keep `CLAUDE.md` short. If a section grows long, move the detail into a
  `/docs` file and leave a one-line pointer.

## 5. Optional niceties

- Add a `.claude/` note or use `/init` inside Claude Code to let it generate its
  own starter CLAUDE.md — but prefer the curated one here; it's tuned to how you
  want to work.
- You can create custom slash commands later (e.g. a `/verify` that runs
  expo-doctor + lint + tests) once we have those set up.
