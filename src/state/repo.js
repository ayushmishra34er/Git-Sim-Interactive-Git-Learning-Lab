//--- state ---

export let repo = {
  initialized: false,
  commits: [],       // { id, message, timestamp }
  staged: [],         // list of staged "file" names (fake — just strings for now)
  branches: { main: [] }, // branch name -> array of commit ids (simplify however makes sense to you)
  HEAD: "main"
};