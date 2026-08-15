//selectors
const DOM = {
    terminalContent: document.querySelector('.terminal-content'),
    terminalText: document.querySelector('.terminal-text'),

}

const terminalInputLine = document.createElement("div");

terminalInputLine.setAttribute('id', 'line-1');
terminalInputLine.setAttribute('class', 'terminal-text');
terminalInputLine.textContent = "$>";

DOM.terminalContent.appendChild(terminalInputLine);

