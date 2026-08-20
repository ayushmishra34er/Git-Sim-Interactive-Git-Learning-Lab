import { Commit } from '../models/Commit.js';

export class GitEngine {
    constructor() {
        this.repo = {
            initialized: false,
            commits: [],
            staged: [],
            branches: { main: [] },
            HEAD: "main"
        };
    }

    execute(input) {
        const parts = input.trim().split(" ");
        const command = parts[0];
        const subcommand = parts[1];
        const args = parts.slice(2);

        if (command !== "git") return `command not found: ${command}`;
        if (!subcommand) return "usage: git <command> [<args>]";

        switch (subcommand) {
            case "init": return this.init();
            case "add": return this.add(args);
            case "commit": return this.commit(args.join(" "));
            case "status": return this.status();
            case "log": return this.log();
            case "push": return this.push();
            default: return `git: '${subcommand}' is not a git command`;
        }
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

        const messageMatch = input.match(/-m\s+"([^"]+)"/);
        const message = messageMatch ? messageMatch[1] : "no message";

        const newCommit = new Commit(message);
        this.repo.commits.unshift(newCommit);
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
        if (this.repo.commits.length === 0) {
            return `fatal: your current branch '${this.repo.HEAD}' does not have any commits yet`;
        }
        let logOutput = "";
        for (const c of this.repo.commits) {
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
}