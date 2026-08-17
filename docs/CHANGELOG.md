# Changelog

All notable changes to GitLab-Sim are logged here, per version. This is a running record —
update it every time you tag a version, before you push. It's what lets you (or anyone else)
understand what changed without reading every commit.

---

## [v0.5.5] — In Progress
### Added
- `git push` command simulation using a real Promise + async/await
- Simulated 2-second network delay with a "Pushing to origin..." loading message
- Success/failure output after the simulated push completes

### Why
Custom pivot from the main roadmap to align project work with concurrent Promises/async-await
study. Does not block or change v0.6 (OOP/Classes) — resumes main roadmap after this.

---

## [v0.5] — Modular Architecture
### Changed
- Refactored the single `app.js` file into ES Modules:
  `state/repo.js`, `engine/commandParser.js`, `events/terminalEvents.js`, `utils/idGenerator.js`
- `index.html` script loading updated to use ES Modules

### Known issues introduced (see bug list / fix before tagging complete)
- Script tags not marked `type="module"`
- `repo` not exported from `state/repo.js`
- Import path typo: `idGenerators.js` → should be `idGenerator.js`
- `components/buildElement.js` referenced but not yet created
- `setupTerminalEvents` imported but not invoked
- `inputE1` / output element undefined inside `terminalEvents.js`

---

## [v0.4] — Real State Machine
### Added
- `repo` state object: `initialized`, `commits`, `staged`, `branches`, `HEAD`
- Command parser (`handleCommand`) with real subcommand routing
- `git init`, `git add`, `git commit -m "..."`, `git status`, `git log` — real logic, not echoed text
- Regex-based parsing of `-m "message"` commit messages
- Commit ID generation

---

## [v0.3] — Real Event Handling
### Added
- `keydown` listener on terminal input — Enter submits the command
- Command echo displayed as new scrollback lines (fixed initial bug: was overwriting a single
  static line instead of appending new ones)
- Click event delegation on `.terminal-content` (practice — not yet used for real functionality)

---

## [v0.2] — DOM-Built Terminal UI
### Added
- `buildElement()` helper — reusable wrapper around `createElement`/`appendChild`/attribute-setting
- Terminal input line and theory panel content built dynamically via JS instead of static HTML

### Fixed
- Initial bug where `buildElement` was called with a 3-argument signature, causing the options
  object to be interpreted as `text` and rendered as `"[object Object]"`

---

## [v0.1] — Static Skeleton
### Added
- Three-panel grid layout: terminal (left), commit graph placeholder (center), theory panel (right)
- Top navbar with logo, brand, and placeholder chapter name
- Base CSS styling (dark terminal theme, grid-paper background on visual panel)