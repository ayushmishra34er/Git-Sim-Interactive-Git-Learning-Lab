export const chapters = [
  {
    id: "intro",
    title: "What is Git?",
    text: "Git tracks changes to your files over time. Every change you save becomes a 'commit' — a snapshot you can always come back to.",
    unlocksOn: "init"
  },
  {
    id: "staging",
    title: "Staging & Commits",
    text: "Before a change becomes a commit, it's 'staged' — marked as ready to be saved. Use 'git add <file>' to stage, then 'git commit -m \"message\"' to save it permanently.",
    unlocksOn: "commit"
  },
  {
    id: "branching",
    title: "Branching",
    text: "A branch is an independent line of work. 'git branch <name>' creates one, 'git checkout <name>' switches to it. Changes on one branch don't affect another until you merge.",
    unlocksOn: "branch"
  },
  {
    id: "merging",
    title: "Merging",
    text: "'git merge <branch>' brings another branch's changes into your current one. If your branch hasn't diverged, it's a simple 'fast-forward'. If both branches have unique commits, Git needs you to resolve the difference.",
    unlocksOn: "merge"
  },
  {
    id: "remotes",
    title: "Remotes",
    text: "A remote (like GitHub) is a copy of your repo hosted elsewhere. 'git push' sends your commits there.",
    unlocksOn: "push"
  }
];