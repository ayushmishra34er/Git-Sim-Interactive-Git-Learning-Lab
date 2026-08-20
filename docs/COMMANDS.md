# Commands Reference

This file is the spec for how each simulated git command should behave — what it checks,
what it mutates in `repo` state, and what output it returns. Treat this as the source of
truth when implementing a command: write the row here first, then implement to match it.
Update this file whenever you add or change a command's behavior.

---

## Implemented (v0.4 — v0.5)

| Command | Preconditions checked | State mutated | Output |
|---|---|---|---|
| `git init` | none | `repo.initialized = true` | `"Initialized empty Git repository in /project/.git/"` (or "Reinitialized..." if already initialized) |
| `git add <file>` | `repo.initialized` must be true | pushes filename into `repo.staged` | `""` (silent, matches real git behavior) |
| `git add .` | `repo.initialized` must be true | pushes placeholder `"all_modified_files"` into `repo.staged` | `""` |
| `git commit -m "msg"` | `repo.initialized`, `repo.staged.length > 0` | creates commit object, unshifts into `repo.commits`, clears `repo.staged` | `"[<branch> <id>] <message>\n 1 file changed"` |
| `git status` | `repo.initialized` | none (read-only) | branch name + staged files, or "nothing to commit, working tree clean" |
| `git log` | `repo.initialized`, `repo.commits.length > 0` | none (read-only) | formatted list of all commits, most recent first |
`git branch <name>`|  `git checkout <name>` / `git switch <name>`

---

## In Progress (v0.5.5)

| Command | Preconditions checked | State mutated | Output |
|---|---|---|---|
| `git push` | `repo.initialized` | none yet (simulated — no real remote state tracked) | Async: shows `"Pushing to origin..."` then, after ~2s delay, a success message | `git merge <name>` | both branches must exist | fast-forward: current branch pointer moves to match target; diverged: no mutation | success message, or `"Merge conflict simulation: both branches have diverged"`|

---

## Planned (v0.7)

| Command | Preconditions checked | State mutated | Output |
|---|---|---|---|
|  | `repo.initialized`, name doesn't already exist | adds new entry to `repo.branches` pointing at current HEAD's commit | confirmation, or error if branch exists |
| | branch must exist | `repo.HEAD = <name>` | `"Switched to branch '<name>'"` or error |


---

## Deferred to v2.0+ (do not implement before v1.0 ships)
`rebase`, `cherry-pick`, `bisect`, `reflog`, `stash` (full), `submodules`, `hooks`, `worktree`

Recording these here (not just in ROADMAP.md) so if you're tempted mid-build to add one,
check here first — it's already been decided these wait until after v1.0.

---

## Data model reference (current, as of v0.4/v0.5)
```js
repo = {
  initialized: boolean,
  commits: [ { id, message, timestamp } ],   // will change shape in v0.7 — see below
  staged: [ "filename", ... ],
  branches: { main: [...] },                  // will change shape in v0.7 — see below
  HEAD: "main"
}
```

### Planned data model change at v0.7
Commits will gain a `parentId` field (linked-list style, mirrors real git internals), and
`branches` will change from arrays of commit ids to a simple pointer: `{ main: "commit-3" }`.
This is necessary for the graph visualization to be able to walk commit history. Don't build
new features on top of the current array-based `branches` shape — it's getting replaced.


---
git init
git add .
git commit -m "first commit"
git branch feature
git checkout feature
git add .
git commit -m "feature work"
git log                      → should show 2 commits (feature branch's history)
git checkout main
git log                      → should show only 1 commit (main never moved)
git merge feature
git log                      → should now show 2 commits (fast-forwarded)
git checkout main            (already on main, but test it doesn't break)
git branch other
git checkout other
git add .
git commit -m "other work"
git checkout main
git merge other               → should fast-forward again



For a genuine divergence test:

git branch a
git branch b
git checkout a
git add . && git commit -m "a commit"
git checkout b
git add . && git commit -m "b commit"
git checkout a
git merge b     → should print "Merge conflict simulation: both branches have diverged"

---