# Changelog

All notable changes to Git-Sim, per version. Update this before tagging any new version.

---

## [v1.0] — Ship

### Added

- Final README rewrite with full feature list, run instructions, and project structure
- MIT LICENSE
- CSS polish pass: fixed nested-scroll bug (whole page was scrolling instead of just the
  terminal output), fixed nav bar vertical centering and bezel issue, consolidated duplicate
  CSS rules, removed dead/unused styles from early experimentation

### Fixed (rollup of fixes since v0.9)

- Commit message regex now accepts `-m"message"` with no space, not just `-m "message"`
- Reset button and dynamic chapter label were silently broken due to selector typos
  (`getElementById('#id')` instead of `getElementById('id')`, and a missing `id` attribute)
  — one uncaught error had been silently preventing the rest of `app.js` from running
- Terminal input/output were both appending to the same container, causing the input row to
  scroll out of view as history grew — split into a separate scrollable output area and a
  fixed input row

### Status

Vanilla JavaScript build considered feature-complete and portfolio-ready as of this tag.

---

## [v0.9] — Persistence, Chapters, Reset, Command History

### Added

- `GitEngine.save()`/`load()` — full repo state and current chapter persist to `localStorage`
- `GitEngine.reset()` + wired-up Reset button — clears storage and reloads to a fresh state
- Chapter progression: `getCurrentChapter()` / `advanceChapterIfMatched()`, driven by
  `src/content/chapters.js`, advances automatically as matching commands succeed
- Command history via Up/Down arrow keys in the terminal input
- Branch-aware graph layout (lane assignment): branches now visually diverge into their own
  row only once they have unique commits, instead of all commits sitting on one flat line

---

## [v0.7] — Branching, Merging, Graph Visualization

### Added

- `Commit` now carries `parentId`, forming a real linked-list commit history
- `getHistory(commitId)` — walks the parent chain backward from any commit
- `git branch <name>`, `git checkout`/`switch`, `git merge` — with real fast-forward vs.
  diverged-branch detection based on walking commit history
- SVG commit graph rendered in the visual panel, redrawn after every command

### Notes

Delivered together with v0.6 in practice — the Classes refactor and the branch/merge logic
were built in the same working session.

---

## [v0.6] — Classes

### Changed

- `Commit` and `GitEngine` converted to real ES6 classes
- All command logic (`init`, `add`, `commit`, `status`, `log`, `push`) centralized into
  `GitEngine` methods, dispatched through one `execute()` method
- `repo` state moved from a standalone exported object to `this.repo` on the engine instance
- `commandParser.js` removed entirely — superseded by `GitEngine.js`

---

## [v0.5.5] — Async Push Simulation

### Added

- `git push` implemented with a real `Promise`, simulated ~2s network delay, and a live
  "Pushing to origin..." loading state using `async`/`await` and `try`/`catch`
- Custom pivot from the main roadmap to align project work with concurrent Promises/async-await
  study; did not block or change v0.6

---

## [v0.5] — Modular Architecture

### Changed

- Refactored the single `app.js` file into ES Modules: `state/`, `engine/`, `events/`,
  `components/`, `utils/`
- `index.html` updated to load a single `type="module"` entry point

### Fixed

- Several wiring bugs from the initial refactor: unexported `repo`, an import path typo,
  a missing `components/buildElement.js`, `setupTerminalEvents` never being invoked, and
  undefined variable references inside `terminalEvents.js`

---

## [v0.4] — Real State Machine

### Added

- `repo` state object: `initialized`, `commits`, `staged`, `branches`, `HEAD`
- Command parser with real subcommand routing
- `git init`, `git add`, `git commit -m "..."`, `git status`, `git log` — real logic, not
  echoed text
- Regex-based parsing of `-m "message"` commit messages
- Commit ID generation

---

## [v0.3] — Real Event Handling

### Added

- `keydown` listener on terminal input — Enter submits the command
- Command echo displayed as new scrollback lines
- Click event delegation on the terminal content (practice, later removed as unused)

---

## [v0.2] — DOM-Built Terminal UI

### Added

- `buildElement()` helper — reusable wrapper around `createElement`/`appendChild`
- Terminal input line and theory panel content built dynamically via JS instead of static HTML

---

## [v0.1] — Static Skeleton

### Added

- Three-panel grid layout: terminal (left), commit graph placeholder (center), theory panel
  (right)
- Top navbar with logo, brand, and placeholder chapter name
- Base CSS styling (dark terminal theme, grid-paper background on visual panel)
