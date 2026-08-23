import { buildElement } from '../components/buildElement.js';
import { renderGraph } from '../components/graphRenderer.js';


export function setupTerminalEvents(DOM, engine) {
    const newDiv = buildElement(DOM.terminalContent, 'div', '', { className: 'terminal-input-line' });
    buildElement(newDiv, 'span', 'user@git-sim:~$ ', { className: 'prompt-text' });
    const inputE1 = buildElement(newDiv, 'input', '', {
        className: 'terminal-input',
        attributes: { type: 'text', placeholder: 'type a git command here ... ', autocomplete: 'off' }
    });

    inputE1.addEventListener('keydown',async function (e) {
        if (e.key === 'Enter') {
            const userCommand = inputE1.value;

            buildElement(DOM.terminalContent, 'p', `user@git-sim:~$ ${userCommand}`, {
                className: 'terminal-output',
                attributes: { style: 'color: #00ff00;' }
            });

           

            inputE1.value = "";
        
        
              if (userCommand.trim().startsWith("git push")) {
            const loadingLine = buildElement(DOM.terminalContent, 'p', "Pushing to origin...", {
                className: 'terminal-output',
                attributes: { style: 'color: #ccc;' }
            });

            try {
                const result = await engine.execute(userCommand);
                loadingLine.textContent = result;
            } catch (err) {
                loadingLine.textContent = err;
                loadingLine.style.color = "#ff5f56";
            }
        } else {
            const systemResponse = await engine.execute(userCommand);
            if (systemResponse !== "") {
                buildElement(DOM.terminalContent, 'p', systemResponse, {
                    className: 'terminal-output',
                    attributes: { style: 'color: #ccc; white-space: pre-wrap;' }
                });
            }
        }
        
        renderGraph(engine.repo, DOM.graphContainer);
        DOM.terminalContent.scrollTop = DOM.terminalContent.scrollHeight;
    
        
        }
    });
}