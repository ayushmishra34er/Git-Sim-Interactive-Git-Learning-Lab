# Git-Sim — Interactive Git Learning Lab

A browser-based, JavaScript-simulated Git environment. Type real git commands into a
terminal-style UI, watch a JS-powered engine parse and execute them against an in-memory
fake repository, and see the resulting commit graph rendered live — with theory alongside
so the "why," not just the "how," sticks.

No real git is involved under the hood — this is a teaching simulation, not a wrapper
around actual git. That's intentional: it means it's 100% safe to experiment in, and the
whole engine is transparent, readable JavaScript rather than a black box.

## Status: v0.5 (in progress — see known issues below)

## Why this project exists

Built as a learning-by-building exercise: rather than doing disconnected syntax exercises,
every JS concept learned gets applied directly to extending this one app. See `docs/ROADMAP.md`
for the full version-by-version plan and `docs/CHANGELOG.md` for what's actually shipped so far.

## Features (current)

- **Custom DOM engine** — a reusable `buildElement()` factory function used throughout instead
  of hardcoded HTML, for real DOM-manipulation practice
- **Command parser + state machine** — a JS object tracking repo state (init status, staged
  files, commits, branches, HEAD), mutated by real command logic, not fake echoed text
- **Modular architecture** — code is split by responsibility (`state/`, `engine/`, `events/`,
  `components/`, `utils/`) using ES Modules

## Supported commands (current)

`git init` · `git add <file>` / `git add .` · `git commit -m "message"` · `git status` · `git log`

See `docs/COMMANDS.md` for exact behavior specs, and what's planned next (`branch`, `checkout`,
`merge`, and more).

## Known issues (v0.5, pre-fix)

The v0.4 → v0.5 modularization refactor is not yet fully wired — see the fix list below before
this version is considered complete. Tracked in `docs/CHANGELOG.md` under `[v0.5]`.

- Script tags in `index.html` need `type="module"`
- `repo` needs to be exported from `state/repo.js`
- Import path typo: `idGenerators.js` → `idGenerator.js`
- `components/buildElement.js` needs to be created (currently only exists inline in old code)
- `setupTerminalEvents()` needs to actually be called from `app.js`
- `terminalEvents.js` needs its own local `inputE1`/output element references

## How to run locally

This project uses ES Modules (`import`/`export`), which browsers block over `file://` due to
CORS. You need to serve it via a local server:

**Option 1 — VS Code:** install the "Live Server" extension, right-click `index.html` → "Open with Live Server"

**Option 2 — Python:**

```bash
python3 -m http.server
```

then visit `http://localhost:8000`

## Project structure

```
src/
├── app.js              entry point — wires everything together
├── state/               repo state object
├── engine/               command parser + git command logic
├── components/           DOM-building helpers (buildElement)
├── events/               terminal input event handling
└── utils/                small helpers (id generation, etc.)
docs/
├── ROADMAP.md            full version-by-version build plan
├── CHANGELOG.md          what shipped in each version
└── COMMANDS.md           spec for each simulated git command
```

## Roadmap

Full plan through v1.0 (and beyond) lives in `docs/ROADMAP.md`. Short version: DOM → events →
real state → modular architecture → OOP → branching/merging + graph visualization → async →
persistence → v1.0 ship.

## License

Not yet decided — add one before making the repo public-facing as a portfolio piece (MIT is a
common, permissive default for this kind of project).


