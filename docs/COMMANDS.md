# Commands Reference

Spec for how each simulated git command behaves — what it checks, what it mutates in `repo`
state, and what output it returns. Update this whenever a command's behavior changes.

---

## Implemented (v0.4 — v0.9)

| Command                                     | Preconditions checked                          | State mutated                                                                                                                             | Output                                                                     |
| ------------------------------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `git init`                                  | none                                           | `repo.initialized = true`                                                                                                                 | init message, or "Reinitialized..." if already done                        |
| `git add <file>`                            | `repo.initialized`                             | pushes filename into `repo.staged`                                                                                                        | `""` (silent, matches real git)                                            |
| `git add .`                                 | `repo.initialized`                             | pushes placeholder `"all_modified_files"` into `repo.staged`                                                                              | `""`                                                                       |
| `git commit -m "msg"`                       | `repo.initialized`, `repo.staged.length > 0`   | creates `Commit` (with `parentId` from current branch tip), unshifts into `repo.commits`, advances `repo.branches[HEAD]`, clears `staged` | `"[<branch> <id>] <message>"`                                              |
| `git status`                                | `repo.initialized`                             | none (read-only)                                                                                                                          | branch name + staged files, or clean message                               |
| `git log`                                   | `repo.initialized`, current branch has commits | none (read-only)                                                                                                                          | history walked via `getHistory()` from branch tip, most recent first       |
| `git push`                                  | `repo.initialized`                             | none (no real remote state tracked)                                                                                                       | async — "Pushing to origin..." then success after ~2s, via real Promise    |
| `git branch <name>`                         | `repo.initialized`, name not already taken     | adds entry to `repo.branches` pointing at current HEAD's tip                                                                              | `""` on success, error if name exists                                      |
| `git checkout <name>` / `git switch <name>` | branch must exist                              | `repo.HEAD = <name>`                                                                                                                      | switch confirmation, or error                                              |
| `git merge <name>`                          | both branches exist                            | fast-forward: `repo.branches[HEAD]` moves to target tip; diverged: no mutation                                                            | fast-forward message, "Already up to date," or diverged-simulation message |

Chapter progression and `localStorage` persistence happen automatically after every successful
command via `GitEngine.execute()` — not command-specific, so not listed per-row here.

---

## Deferred to v2.0+ (do not implement without updating this list first)

`rebase`, `cherry-pick`, `bisect`, `reflog`, `stash` (full), `submodules`, `hooks`, `worktree`

**Also deferred, added during v1.0 discussion:**

- **A real fake filesystem** — currently `git add <file>` just stores filename strings with no
  actual file contents behind them. A genuine v2.0 feature would track real fake file contents
  so `git diff` and `git add -p` style behavior could be simulated properly. This is a real
  feature addition, not a bug fix — scope it as its own version if pursued.

---

## Data model (current, as of v0.9/v1.0)

```js
repo = {
  initialized: boolean,
  commits: [ Commit, ... ],   // newest-first; each has { id, message, parentId, timestamp }
  staged: [ "filename", ... ],
  branches: { branchName: commitId | null },  // each points at that branch's tip commit
  HEAD: "branchName"
}
```

Commits form a real linked list via `parentId` — this is what `getHistory()`, `log()`, and
`merge()`'s fast-forward/diverged detection all rely on. Don't change this shape without
updating all three.
