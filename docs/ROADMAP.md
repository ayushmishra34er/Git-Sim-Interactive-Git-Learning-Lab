# Git-Sim — Roadmap

## Vanilla JavaScript build: COMPLETE as of v1.0

Every planned version (v0.1 through v0.9, plus the async-push pivot at v0.5.5) shipped and is
documented in `docs/CHANGELOG.md`. v1.0 closed out with final polish, docs, and license.
This track is done — treat any further vanilla-JS work as a deliberate v2.0, not drift.

---

## What's next (pick one, don't run both at once)

### Option A — React rebuild

Full phase-by-phase plan already written (`docs/REACT_ROADMAP.md` if saved into this repo, or
wherever it's been kept). Reuses `GitEngine`/`Commit` almost unchanged; rebuilds only the UI
layer as components. Tailwind is folded into that plan once component structure exists.

### Option B — Vanilla v2.0

If continuing the vanilla build instead: the deferred list in `docs/COMMANDS.md` is the
starting point — expand the command set (`rebase`, `cherry-pick`, etc.) and/or build the real
fake filesystem noted there. Scope it as its own version with its own Definition of Done,
same discipline as every version before it.

---

## Not yet planned in detail (revisit when actually close)

- MERN backend extension (real accounts, persistent progress across devices) — general topic
  list exists in the separate full reading guide; full version plan intentionally deferred
  until this stage is actually reached, so it reflects current tooling rather than going stale
