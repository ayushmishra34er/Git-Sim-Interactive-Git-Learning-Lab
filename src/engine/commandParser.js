function handleCommand(input) {
  const parts = input.trim().split(" ");
  const command = parts[0]; // "git"
  const subcommand = parts[1]; // "init", "add", "commit", etc.
  const args = parts.slice(2); // remaining args

  if (command !== "git") {
    return `command not found: " ${command}`;
  }

  if (!subcommand) {
    return "usage: git <command> [<args>]";
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

function handleInit(){
    if(repo.initialized) {
        return "Reinitialized existing Git repository.";

    }

    repo.initialized = true;
    return "Initialized empty Git repository in /project/.git/"
};

function handleStatus() {
    if(!repo.initialized){
        return "fatal: not a git repository (or any of parent directories): .git"
    }

    if(repo.staged.length === 0){
        return `On branch ${repo.HEAD}\nnothing to commit, working tree clean`;
    } else {
        return `On branch ${repo.HEAD}\nChanges to be committed:\n  (use "git restore --staged <file>..." to unstage)\n\n\tnew file:   ${repo.staged.join(", ")}`;
    }
};

function handleAdd(args) {
    if(!repo.initialized ){
        return "fatal: not a git repository (or any of the parent directories): .git";
    }

    if(args.length === 0){
            return "Nothing specified, nothing added.";
       
        }

        const fileToAdd = args[0] === "." ? "all_modified_files" : args.join(" ");

        repo.staged.push(fileToAdd);

        return "";

}

function handleCommit(input) {
    if (!repo.initialized) return "fatal: not a git repository";
    if (repo.staged.length === 0) return "nothing to commit, working tree clean";

    const messageMatch = input.match(/-m\s+"([^"]+)"/);
    const message = messageMatch ? messageMatch[1] : "no message";
    

    const commitId = "commit-" + Math.random().toString(36).substr(2, 5);


    const newCommit = {
        id: commitId, 
        message: message,
        timestamp: new Date().toLocalString()
    };
    repo.commits.unshift(newCommit);
    repo.staged = [];

    return `[${repo.HEAD} ${commitId}] ${message}\n 1 file changed`;

};

function handleLog() {
    if (!repo.initialized) return "fatal: not a git repository";
    if (repo.commits.length === 0) return `fatal: your current branch '${repo.HEAD}' does not have any commits yet`;

    let logOutput = "";
    
    // Loop through our commits and format them like real Git
    for (let i = 0; i < repo.commits.length; i++) {
        const c = repo.commits[i];
        logOutput += `commit ${c.id}\nDate: ${c.timestamp}\n\n    ${c.message}\n\n`;
    }
    
    return logOutput.trim();
}