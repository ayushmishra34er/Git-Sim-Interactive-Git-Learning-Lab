
import { buildElement } from './components/buildElement.js';
import { setupTerminalEvents } from './events/terminalEvents.js';
import { GitEngine } from './engine/GitEngine.js';
import {renderGraph} from './components/graphRenderer.js';


//selectors
const DOM = {

    terminalOutput: document.querySelector('#terminal-output'),
    terminalInputRow: document.querySelector('#terminal-input-row'),
    theoryContent: document.querySelector('.theory-content'),
    graphContainer: document.querySelector('.visual-panel'),
    resetBtn : document.querySelector('#reset-btn'),

};


const engine = new GitEngine();
engine.load();


    DOM.resetBtn.addEventListener('click', () => {
    engine.reset();
});

export function renderTheoryPanel() {
    DOM.theoryContent.innerHTML = "";
    const chapter = engine.getCurrentChapter();
    if (!chapter) return;
    buildElement(DOM.theoryContent, 'h1', chapter.title, { className: 'currentChapterHeader' });
    buildElement(DOM.theoryContent, 'p', chapter.text, { className: 'terminal-output-text' });
    document.getElementById('chapter-label').textContent = `Chapter: ${chapter.title}`;

}

renderTheoryPanel();
renderGraph(engine.repo, DOM.graphContainer);
setupTerminalEvents(DOM, engine);

