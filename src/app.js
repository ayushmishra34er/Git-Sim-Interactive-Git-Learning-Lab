
import { buildElement } from './components/buildElement.js';
import { setupTerminalEvents } from './events/terminalEvents.js';
import { GitEngine } from './engine/GitEngine.js';

//selectors
const DOM = {
    terminalContent: document.querySelector('.terminal-content'),
    theoryContent: document.querySelector('.theory-content'),


};

const engine = new GitEngine();

 
buildElement(DOM.theoryContent, 'h1', 'Understanding Git Status', {
    className: 'currentChapterHeader',
});


buildElement(DOM.theoryContent, 'p', 'When you type a command in the terminal on the left, this panel will explain the underlying theory, while the center panel maps out the commits visually.',
     {
    className: 'terminal-output-text',
});

const userClickOutput = buildElement(DOM.terminalContent, 'p', '', {
    className: 'userClickedOutput',
})





setupTerminalEvents(DOM, engine);