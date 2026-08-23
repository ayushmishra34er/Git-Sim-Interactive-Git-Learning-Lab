export function renderGraph(repo, container) {
    

    container.innerHTML = "";

    if (!repo.initialized || repo.commits.length === 0)     {
        const msg = document.createElement("div");
        msg.className = "placeholder-text";
        msg.textContent = repo.initialized
        ? "[ No commits yet]"
        : "[Run 'git init' to get started ]";
        container.appendChild(msg);
        return;

    }

const commits = [...repo.commits].reverse();

const spacingX = 100;
const startX = 60;
const rowY = 150;
const radius = 20;

const positions = {};
commits.forEach((c, i) => {
    positions[c.id] ={ x:startX + i * spacingX, y: rowY };
 
});

const width = Math.max(400, startX + commits.length * spacingX +60);


const height = 300;
 
const svgNS = "http://www.w3.org/2000/svg";
const svg = document.createElementNS(svgNS, "svg");
svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
svg.setAttribute("width", "100%");
svg.setAttribute("height", "100%");

commits.forEach((c) => {
    if (c.parentId && positions[c.parentId]) {
        const from = positions[c.parentId];
        const to = positions[c.id];
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", from.x);
        line.setAttribute("y1", from.y);
        line.setAttribute("x2", to.x);
        line.setAttribute("y2", to.y);
        line.setAttribute("stroke", "#adb5bd" );
        line.setAttribute("stroke-width", "2");
        svg.appendChild(line);



    }

});

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
 



        
