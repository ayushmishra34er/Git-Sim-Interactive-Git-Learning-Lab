# Git-Sim — Interactive Git Learning Lab

A browser-based, JavaScript-simulated Git environment. Type real git commands into a
terminal-style UI, watch a hand-built JS engine parse and execute them against an in-memory
fake repository, and see the resulting commit graph rendered live — branches and all — with
theory alongside so the "why," not just the "how," sticks.

No real git is involved under the hood — this is a teaching simulation, not a wrapper around
actual git. That's intentional: it's 100% safe to experiment in, and the whole engine is
transparent, readable JavaScript rather than a black box.

**Built entirely in vanilla JavaScript, HTML, and CSS — no frameworks, no build step required
beyond a local static server.** A React rewrite of this same project exists as a companion
piece; see the "Related" section below.

## Status: v1.0

## Why this project exists

Built as a learning-by-building exercise: every JavaScript concept learned was applied directly
to extending this one app, version by version, rather than through disconnected syntax
exercises. The full build history is in `docs/CHANGELOG.md`; the original version-by-version
plan is in `docs/ROADMAP.md`.

## Features

- **Custom DOM engine** — a reusable `buildElement()` factory function used throughout instead
  of hardcoded HTML
- **Real command parser + state machine** (`GitEngine` class) — tracks initialization, staged
  files, commits, branches, and `HEAD`; every command mutates real state, nothing is faked text
- **Proper commit history model** — commits form a real linked list via `parentId`, exactly how
  git works internally, which is what makes branch/merge logic and the graph actually work
- **Branch-aware SVG commit graph** — branches render in their own visual lane and only diverge
  from the shared history once they have unique commits, redrawn live after every command
- **Async `git push` simulation** — a real `Promise` + `async/await`, with a loading state, not
  a fake instant response
- **Chapter-based theory panel** — advances automatically as you use new commands, teaching
  concepts in the order you actually encounter them
- **Persistent state** — progress, commits, and current chapter are saved to `localStorage` and
  restored on reload; a Reset button clears everything back to a fresh start
- **Command history** — Up/Down arrows recall previous commands, like a real shell
- **Modular ES Module architecture** — code is split by responsibility (`state`, `engine`,
  `events`, `components`, `content`, `utils`)

## Supported commands

`git init` · `git add <file>` / `git add .` · `git commit -m "message"` · `git status` ·
`git log` · `git push` · `git branch <name>` · `git checkout <name>` / `git switch <name>` ·
`git merge <name>`

See `docs/COMMANDS.md` for exact behavior specs and what's intentionally deferred to a future
version.

## How to run locally

This project uses ES Modules (`import`/`export`), which browsers block over `file://` due to
CORS — it needs to be served by a local static server.

**Option 1 — Vite (recommended, includes live reload and error overlays):**

```bash
npm install
npm run dev
```

**Option 2 — VS Code:** install the "Live Server" extension, right-click `index.html` → "Open
with Live Server"

**Option 3 — Python:**

```bash
python3 -m http.server
```

then visit `http://localhost:8000`

## Project structure

```
src/
├── app.js               entry point — wires everything together
├── state/                (repo state helpers)
├── models/               Commit class
├── engine/               GitEngine — all git command logic lives here
├── content/              chapter/theory text
├── components/           DOM-building helpers, SVG graph renderer
├── events/               terminal input handling
└── utils/                small helpers (id generation)
docs/
├── ARCHITECTURE.md       full file-by-file map + data flow trace
├── ROADMAP.md            version-by-version build plan
├── CHANGELOG.md          what shipped in each version
└── COMMANDS.md           spec for each simulated git command
```

For a full walkthrough of how a command flows through the codebase end to end, see
`docs/ARCHITECTURE.md` — start there before making changes.

## Related

A React rewrite of this project (same `GitEngine`, rebuilt UI as components) is planned/in
progress as a companion piece, focused on directly comparing manual DOM manipulation against a
framework's approach to the same problem.

## License

MIT — see `LICENSE`.
