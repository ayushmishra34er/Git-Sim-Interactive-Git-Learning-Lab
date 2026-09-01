
export function renderGraph(repo, container) {
    container.innerHTML = "";

    if (!repo.initialized || repo.commits.length === 0) {
        const msg = document.createElement("div");
        msg.className = "placeholder-text";
        msg.textContent = repo.initialized
            ? "[ No commits yet ]"
            : "[ Run 'git init' to get started ]";
        container.appendChild(msg);
        return;
    }

    const commits = [...repo.commits].reverse(); // oldest first
    const commitById = {};
    commits.forEach((c) => (commitById[c.id] = c));

    // Assign each branch a lane. 'main' always gets lane 0 (top row) if it exists.
    const branchNames = Object.keys(repo.branches);
    branchNames.sort((a, b) => (a === "main" ? -1 : b === "main" ? 1 : 0));

    // Walk each branch backward from its tip. A commit only gets claimed by the FIRST
    // branch (in lane order) that reaches it — so shared ancestor commits stay on main's
    // lane, and a branch only gets its own lane for commits unique to it.
    const laneOf = {};
    branchNames.forEach((branchName, laneIndex) => {
        let cursor = repo.branches[branchName];
        while (cursor && !(cursor in laneOf)) {
            laneOf[cursor] = laneIndex;
            const c = commitById[cursor];
            cursor = c ? c.parentId : null;
        }
    });

    const spacingX = 100;
    const startX = 60;
    const laneHeight = 70;
    const topPadding = 60;
    const radius = 20;

    const positions = {};
    commits.forEach((c, i) => {
        const lane = laneOf[c.id] ?? 0;
        positions[c.id] = { x: startX + i * spacingX, y: topPadding + lane * laneHeight };
    });

    const maxLane = Math.max(0, ...Object.values(laneOf));
    const width = Math.max(400, startX + commits.length * spacingX + 60);
    const height = topPadding + (maxLane + 1) * laneHeight + 60;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    // edges (drawn first, sit behind nodes) — a diagonal line here is exactly what shows
    // a branch diverging from its parent's lane into its own
    commits.forEach((c) => {
        if (c.parentId && positions[c.parentId]) {
            const from = positions[c.parentId];
            const to = positions[c.id];
            const line = document.createElementNS(svgNS, "line");
            line.setAttribute("x1", from.x);
            line.setAttribute("y1", from.y);
            line.setAttribute("x2", to.x);
            line.setAttribute("y2", to.y);
            line.setAttribute("stroke", "#adb5bd");
            line.setAttribute("stroke-width", "2");
            svg.appendChild(line);
        }
    });

    // commit nodes + labels
    commits.forEach((c) => {
        const pos = positions[c.id];

        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", pos.x);
        circle.setAttribute("cy", pos.y);
        circle.setAttribute("r", radius);
        circle.setAttribute("fill", "#4ade80");
        circle.setAttribute("stroke", "#171717");
        circle.setAttribute("stroke-width", "2");
        svg.appendChild(circle);

        const idLabel = document.createElementNS(svgNS, "text");
        idLabel.setAttribute("x", pos.x);
        idLabel.setAttribute("y", pos.y + radius + 16);
        idLabel.setAttribute("text-anchor", "middle");
        idLabel.setAttribute("font-size", "11");
        idLabel.setAttribute("fill", "#333");
        idLabel.textContent = c.id;
        svg.appendChild(idLabel);

        const msgLabel = document.createElementNS(svgNS, "text");
        msgLabel.setAttribute("x", pos.x);
        msgLabel.setAttribute("y", pos.y + radius + 32);
        msgLabel.setAttribute("text-anchor", "middle");
        msgLabel.setAttribute("font-size", "10");
        msgLabel.setAttribute("fill", "#666");
        const shortMsg = c.message.length > 14 ? c.message.slice(0, 14) + "\u2026" : c.message;
        msgLabel.textContent = shortMsg;
        svg.appendChild(msgLabel);
    });

    // branch labels, grouped by which commit they currently point at
    const branchesByTip = {};
    for (const [name, tipId] of Object.entries(repo.branches)) {
        if (!tipId) continue;
        if (!branchesByTip[tipId]) branchesByTip[tipId] = [];
        branchesByTip[tipId].push(name);
    }

    for (const [tipId, names] of Object.entries(branchesByTip)) {
        const pos = positions[tipId];
        if (!pos) continue;

        names.forEach((name, i) => {
            const isHead = name === repo.HEAD;
            const label = document.createElementNS(svgNS, "text");
            label.setAttribute("x", pos.x);
            label.setAttribute("y", pos.y - radius - 10 - i * 16);
            label.setAttribute("text-anchor", "middle");
            label.setAttribute("font-size", "12");
            label.setAttribute("font-weight", isHead ? "bold" : "normal");
            label.setAttribute("fill", isHead ? "#f97316" : "#171717");
            label.textContent = isHead ? `${name} (HEAD)` : name;
            svg.appendChild(label);
        });
    }

    container.appendChild(svg);
}