# GitLab-Sim — Self-Guided Plan: v0.4 to v0.7

Follow each version fully before moving to the next. Each has: what to read, what to build,
common traps to watch for, and a concrete "Definition of Done" checklist. Test against the
checklist yourself — don't just eyeball it working once.

---

## v0.4 — Real State: init, add, commit, status, log

**Read first:** javascript.info — Objects, Array methods (`push`, `find`, `filter`, `map`), destructuring/spread

### Build

1. **State object** (put this in `src/state/repo.js` if you're ready to modularize, or top of `app.js` for now):
```js
let repo = {
  initialized: false,
  commits: [],       // { id, message, timestamp }
  staged: [],         // list of staged "file" names (fake — just strings for now)
  branches: { main: [] }, // branch name -> array of commit ids (simplify however makes sense to you)
  HEAD: "main"
};
```
You don't need real files — since there's no real filesystem, "adding a file" can just mean the user types `git add <filename>` and you push that filename string into `repo.staged`.

2. **A command parser.** Replace your current "just echo the text" logic with real parsing:
```js
function handleCommand(input) {
  const parts = input.trim().split(" ");
  const command = parts[0]; // "git"
  const subcommand = parts[1]; // "init", "add", "commit", etc.
  const args = parts.slice(2); // remaining args

  if (command !== "git") {
    return "command not found: " + command;
  }

  switch (subcommand) {
    case "init": return handleInit();
    case "add": return handleAdd(args);
    case "commit": return handleCommit(args);
    case "status": return handleStatus();
    case "log": return handleLog();
    default: return `git: '${subcommand}' is not a git command`;
  }
}
```

3. **Implement each handler function** — real logic, not fake text:
   - `handleInit()` → sets `repo.initialized = true`, returns a message
   - `handleAdd(args)` → pushes filename(s) into `repo.staged`, handle `git add .` as "stage everything" (can be a fake placeholder since there's no real file list)
   - `handleCommit(args)` → look for `-m "message"` in args (this parsing is a little fiddly — see trap below), create a commit object `{id, message, timestamp}`, push into current branch's commit array, clear `repo.staged`
   - `handleStatus()` → return a formatted string based on `repo.staged` and whether there are uncommitted changes
   - `handleLog()` → return a formatted string of all commits in the current branch, most recent first

4. **Wire it into your existing event listener** — instead of directly calling `buildElement` with the raw input, call `handleCommand(userCommand)` and display *that* return value as the output line instead.

### Common traps
- **Parsing `-m "commit message with spaces"` is the trickiest part.** Splitting on spaces naively breaks quoted strings. Simplest approach for now: use a regex to extract anything between quotes, e.g.
  ```js
  const messageMatch = input.match(/-m\s+"([^"]+)"/);
  const message = messageMatch ? messageMatch[1] : "no message";
  ```
  Don't overengineer this yet — a regex is fine, real git argument parsing is a whole topic on its own.
- **Don't let `commit` succeed if nothing is staged and nothing was ever added.** Check `repo.staged.length === 0` and return an error message instead — this is realistic git behavior and good practice for you.
- **Generate unique commit IDs** — even a simple counter (`commit-1`, `commit-2`) or `Date.now().toString(36).slice(-6)` is fine, doesn't need to be a real SHA yet.

### Definition of Done
- [ ] `git init` works, and running any other command before `init` shows an error
- [ ] `git add somefile.js` adds to staged list
- [ ] `git commit -m "message"` creates a real commit object, clears staged
- [ ] `git status` accurately reflects current staged/clean state
- [ ] `git log` shows all commits made so far, in order
- [ ] `console.log(repo)` at any point matches what you'd expect from the commands you've run

---

## v0.5 — Modules & Architecture (refactor only, no new features)

**Read first:** javascript.info — Modules (import/export)

### Build
Split your single `app.js` into this structure:
```
src/
├── app.js                    (entry point — imports everything, wires up event listeners)
├── state/
│   └── repo.js                (the repo state object + any direct state-mutation helpers)
├── engine/
│   └── commandParser.js       (handleCommand + all the handleInit/handleAdd/etc. functions)
├── components/
│   └── buildElement.js        (your existing helper, moved here)
├── events/
│   └── terminalEvents.js       (the keydown listener logic)
└── utils/
    └── idGenerator.js          (small helper for generating commit IDs)
```

Use `export`/`import`:
```js
// state/repo.js
export let repo = { ... };

// engine/commandParser.js
import { repo } from '../state/repo.js';
export function handleCommand(input) { ... }

// app.js
import { handleCommand } from './engine/commandParser.js';
```

**Important:** your `index.html` script tag needs `type="module"` for `import`/`export` to work in the browser:
```html
<script type="module" src="src/app.js"></script>
```

### Common traps
- If you open `index.html` directly via `file://` in the browser, ES modules often get blocked by CORS. You need to serve it via a local server. Easiest options: VS Code's "Live Server" extension, or run `python3 -m http.server` in the project folder and visit `localhost:8000`.
- Circular imports (module A imports B, B imports A) will cause weird bugs — if you hit this, it usually means state should live in its own file that both sides import from, rather than passing it back and forth.

### Definition of Done
- [ ] App works identically to v0.4 — same commands, same behavior
- [ ] Code is split across the files above, using real `import`/`export`
- [ ] No functionality lost, no console errors
- [ ] You're running it through a local server, not `file://`

---

## v0.6 — Classes

**Read first:** javascript.info — Classes

### Build
1. **`Commit` class** (in `state/` or a new `models/` folder):
```js
class Commit {
  constructor(message) {
    this.id = generateId();
    this.message = message;
    this.timestamp = new Date().toISOString();
  }
}
```
Use `new Commit(message)` in your `handleCommit` function instead of a plain object literal.

2. **`GitEngine` class** — centralize command dispatch instead of a loose `handleCommand` function:
```js
class GitEngine {
  constructor() {
    this.repo = { initialized: false, commits: [], staged: [], branches: { main: [] }, HEAD: "main" };
  }

  execute(input) {
    const [command, subcommand, ...args] = input.trim().split(" ");
    if (command !== "git") return "command not found: " + command;

    switch (subcommand) {
      case "init": return this.init();
      case "add": return this.add(args);
      case "commit": return this.commit(args);
      case "status": return this.status();
      case "log": return this.log();
      default: return `git: '${subcommand}' is not a git command`;
    }
  }

  init() { /* mutate this.repo, return message */ }
  add(args) { /* ... */ }
  commit(args) { /* ... */ }
  status() { /* ... */ }
  log() { /* ... */ }
}
```
Then in `app.js`: `const engine = new GitEngine();` and call `engine.execute(userCommand)` from your event listener instead of the standalone function.

### Common traps
- Watch out for `this` binding issues if you ever pass a class method as a callback directly (e.g. `input.addEventListener('keydown', engine.execute)` would break `this` inside the method). Safer: wrap it in an arrow function, `input.addEventListener('keydown', (e) => engine.execute(...))`, which is what you're likely already doing anyway since you need to read `e.key` and `input.value` first.

### Definition of Done
- [ ] `Commit` is a real class, used via `new Commit(...)`
- [ ] All command logic lives inside a `GitEngine` class, dispatched through one `execute()` method
- [ ] Behavior is unchanged from v0.5 — this is a refactor, not a feature version
- [ ] No console errors, `this` behaves correctly inside all methods

---

## v0.7 — Branch, Checkout, Merge + Visualization

**Read first:** nothing new syntactically — apply what you know. This is the hardest logic so far, budget real time for it.

### Build

1. **`git branch <name>`** — create a new branch pointing at the same commits as the current branch (copy the current branch's commit array, or better: store branches as objects with a reference to a "tip" commit and walk parent pointers — see note below on data modeling)

2. **`git checkout <name>` / `git switch <name>`** — change `repo.HEAD` to the target branch name. Error if branch doesn't exist.

3. **`git merge <name>`** — for now, implement a **simplified fast-forward only**: if the current branch has no commits the other branch doesn't have, just move the current branch's pointer to match the target branch. If both branches have diverged (both have unique commits), show a message like `Merge conflict simulation: both branches have diverged` — you don't need real 3-way merge logic yet, that's deferred.

4. **Reconsider your data model now, before building the graph** — a cleaner way to represent commits that makes graph-drawing much easier:
```js
class Commit {
  constructor(message, parentId = null) {
    this.id = generateId();
    this.message = message;
    this.parentId = parentId;  // null for the very first commit
    this.timestamp = new Date().toISOString();
  }
}
```
And branches just store which commit ID they currently point to:
```js
branches: { main: "commit-3", "feature-x": "commit-2" }
```
This "linked list via parentId" model is literally how real git works internally, and it's what makes drawing the graph tractable — you can walk backward from any branch tip through `parentId` to reconstruct history.

5. **Visualization** — in the (currently empty) `.visual-panel`, render the commit graph:
   - Simplest version: an SVG where each commit is a circle, connected to its parent by a line, positioned left-to-right or top-to-bottom by creation order
   - Label branch names next to the commit they point to, and highlight which one is `HEAD`
   - Redraw the whole graph after every command that changes state (simplest approach — don't worry about efficient incremental updates yet)

### Common traps
- **This version is genuinely hard — don't get discouraged if it takes several sittings.** Merge logic and graph traversal are real computer science, not just JS syntax practice.
- Positioning nodes in the SVG so lines don't overlap is fiddly. Simplest starting approach: just lay out commits in a single horizontal line in creation order, with branch labels stacked above/below their tip commit. Don't attempt a "pretty" force-directed graph layout yet — that's a nice-to-have for way later.
- Re-rendering the whole graph on every command is fine performance-wise at this scale (a learning tool, not thousands of commits) — don't prematurely optimize.

### Definition of Done
- [ ] `git branch <name>` creates a real new branch pointing at the correct commit
- [ ] `git checkout`/`switch` correctly changes `HEAD` and errors on invalid branch names
- [ ] `git merge` correctly fast-forwards when possible, shows a reasonable message when branches have diverged
- [ ] The visual panel shows real commits and branch pointers, updating live as you run commands
- [ ] You can demo the full flow: init → commit → branch → checkout → commit on new branch → checkout main → merge, and watch it all happen correctly in both terminal output and the graph

---

## When you're done with all four
Come back with your code (or just tell me which version, if something's stuck) and I'll review — same as before. If you get stuck mid-version on something confusing, don't grind for hours; come back with the specific error or behavior and we'll unblock it, then you keep going solo from there. That's the efficient way to use both your time and mine.