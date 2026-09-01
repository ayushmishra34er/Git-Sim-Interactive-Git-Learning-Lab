import { Commit } from '../models/Commit.js';
import { chapters } from '../content/chapters.js';


export class GitEngine {
    constructor() {
        this.repo = {
            initialized: false,
            commits: [],
            staged: [],
            branches: { main: null },
            HEAD: "main"
        };
        this.currentChapterIndex = 0;


        
    }

   execute(input) {
    const parts = input.trim().split(" ");
    const command = parts[0];
    const subcommand = parts[1];
    const args = parts.slice(2);

    if (command !== "git") return `command not found: ${command}`;
    if (!subcommand) return "usage: git <command> [<args>]";

    let result;
    switch (subcommand) {
        case "init": result = this.init(); break;
        case "add": result = this.add(args); break;
        case "commit": result = this.commit(args.join(" ")); break;
        case "status": result = this.status(); break;
        case "log": result = this.log(); break;
        case "push": return this.push(); // leave push as-is, it's already a Promise
        case "branch": result = this.branch(args); break;
        case "checkout":
        case "switch": result = this.checkout(args); break;
        case "merge": result = this.merge(args); break;
        default: result = `git: '${subcommand}' is not a git command`;
    }

    if (typeof result === "string" && !result.startsWith("fatal") && !result.startsWith("error") && !result.startsWith("usage")) {
        this.advanceChapterIfMatched(subcommand);
    }
    this.save();
    return result;
}
    

    init() {
        if (this.repo.initialized) {
            return "Reinitialized existing Git repository.";
        }
        this.repo.initialized = true;
        return "Initialized empty Git repository in /project/.git/";
    }

    add(args) {
        if (!this.repo.initialized) {
            return "fatal: not a git repository (or any of the parent directories): .git";
        }
        if (args.length === 0) {
            return "Nothing specified, nothing added.";
        }
        const fileToAdd = args[0] === "." ? "all_modified_files" : args.join(" ");
        this.repo.staged.push(fileToAdd);
        return "";
    }

    commit(input) {
        if (!this.repo.initialized) return "fatal: not a git repository";
        if (this.repo.staged.length === 0) return "nothing to commit, working tree clean";

        const messageMatch = input.match(/-m\s*"([^"]+)"/);
        const message = messageMatch ? messageMatch[1] : "no message";

        const parentId = this.repo.branches[this.repo.HEAD]
        const newCommit = new Commit(message, parentId);
        this.repo.commits.unshift(newCommit);
        this.repo.branches[this.repo.HEAD] = newCommit.id;
        this.repo.staged = [];

        return `[${this.repo.HEAD} ${newCommit.id}] ${message}\n 1 file changed`;
    }

    status() {
        if (!this.repo.initialized) {
            return "fatal: not a git repository (or any of parent directories): .git";
        }
        if (this.repo.staged.length === 0) {
            return `On branch ${this.repo.HEAD}\nnothing to commit, working tree clean`;
        }
        return `On branch ${this.repo.HEAD}\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\n\tnew file:   ${this.repo.staged.join(", ")}`;
    }

    log() {
        if (!this.repo.initialized) return "fatal: not a git repository";

        const tipId = this.repo.branches[this.repo.HEAD];
        if (!tipId) {
            return `fatal: your current branch '${this.repo.HEAD}' does not have any commits yet`
        }

           const history = this.getHistory(tipId);

        let logOutput = "";

        for (const c of history) {
            logOutput += `commit ${c.id}\nDate: ${c.timestamp}\n\n    ${c.message}\n\n`;
        }
        return logOutput.trim();
    }

    push() {
        return new Promise((resolve, reject) => {
            if (!this.repo.initialized) {
                reject("fatal: not a git repository");
                return;
            }
            setTimeout(() => {
                resolve(`To origin\n ${this.repo.HEAD} -> ${this.repo.HEAD}\nEverything up-to-date`);
            }, 2000);
        });
    }


    save() {
  localStorage.setItem("git-sim-repo", JSON.stringify(this.repo));
  localStorage.setItem("git-sim-chapter", this.currentChapterIndex);
}

load() {
  const savedRepo = localStorage.getItem("git-sim-repo");
  const savedChapter = localStorage.getItem("git-sim-chapter");
  if (savedRepo) this.repo = JSON.parse(savedRepo);
  if (savedChapter !== null) this.currentChapterIndex = parseInt(savedChapter, 10);
}


// helpout


    branch(args) {
        if (!this.repo.initialized) return "fatal: not a git repository";
        if (args.length === 0) return "usage: git branch <name>";

        const name = args[0];
        if (Object.prototype.hasOwnProperty.call(this.repo.branches, name)) {
            return `fatal: A branch named '${name}' already exists.`;
        }

        this.repo.branches[name] = this.repo.branches[this.repo.HEAD]; // new branch points at current tip
        return "";
    }

    checkout(args) {
        if (!this.repo.initialized) return "fatal: not a git repository";
        if (args.length === 0) return "usage: git checkout <branch>";

        const name = args[0];
        if (!Object.prototype.hasOwnProperty.call(this.repo.branches, name)) {
            return `error: pathspec '${name}' did not match any file(s) known to git`;
        }

        this.repo.HEAD = name;
        return `Switched to branch '${name}'`;
    }

    merge(args) {
        if (!this.repo.initialized) return "fatal: not a git repository";
        if (args.length === 0) return "usage: git merge <branch>";

        const targetName = args[0];
        if (!Object.prototype.hasOwnProperty.call(this.repo.branches, targetName)) {
            return `merge: ${targetName} - not something we can merge`;
        }

        const currentTip = this.repo.branches[this.repo.HEAD];
        const targetTip = this.repo.branches[targetName];

        if (targetTip === currentTip) {
            return "Already up to date.";
        }

        // Fast-forward is possible if the current branch's tip is somewhere
        // in the target branch's history (i.e. current has no unique commits)
        const currentHistory = this.getHistory(currentTip);
        const targetHistory = this.getHistory(targetTip);


 if (targetTip !== null && currentHistory.some(c => c.id === targetTip)) {
        return "Already up to date.";
    }

        const isFastForward = currentTip === null || targetHistory.some(c => c.id === currentTip);



        if (isFastForward) {
            this.repo.branches[this.repo.HEAD] = targetTip;
            return `Updating ${currentTip ?? "0000000"}..${targetTip}\nFast-forward`;
        }

        return "Merge conflict simulation: both branches have diverged";
    }

    // Walks backward from a commit id through parentId links, returns tip-first array
    getHistory(commitId) {
        const history = [];
        let currentId = commitId;
        while (currentId) {
            const commit = this.repo.commits.find(c => c.id === currentId);
            if (!commit) break;
            history.push(commit);
            currentId = commit.parentId;
        }
        return history;
    }

    getCurrentChapter() {
  return chapters[this.currentChapterIndex];
}

advanceChapterIfMatched(subcommand) {
  const next = chapters[this.currentChapterIndex + 1];
  if (next && next.unlocksOn === subcommand) this.currentChapterIndex++;
}

reset() {
  localStorage.removeItem("git-sim-repo");
  localStorage.removeItem("git-sim-chapter");
  location.reload();
}
};
