import { buildElement } from '../components/buildElement.js';
import { handleCommand } from '../engine/commandParser.js';

export function setupTerminalEvents(DOM) {
    const newDiv = buildElement(DOM.terminalContent, 'div', '', { className: 'terminal-input-line' });
    buildElement(newDiv, 'span', 'user@git-sim:~$ ', { className: 'prompt-text' });
    const inputE1 = buildElement(newDiv, 'input', '', {
        className: 'terminal-input',
        attributes: { type: 'text', placeholder: 'type a git command here ... ', autocomplete: 'off' }
    });

    inputE1.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            const userCommand = inputE1.value;

            buildElement(DOM.terminalContent, 'p', `user@git-sim:~$ ${userCommand}`, {
                className: 'terminal-output',
                attributes: { style: 'color: #00ff00;' }
            });

            const systemResponse = handleCommand(userCommand);
            if (systemResponse !== "") {
                buildElement(DOM.terminalContent, 'p', systemResponse, {
                    className: 'terminal-output',
                    attributes: { style: 'color: #ccc; white-space: pre-wrap;' }
                });
            }

            inputE1.value = "";
            DOM.terminalContent.scrollTop = DOM.terminalContent.scrollHeight;
        }
    });
}