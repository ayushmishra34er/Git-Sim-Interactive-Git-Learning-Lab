//selectors
const DOM = {
    terminalContent: document.querySelector('.terminal-content'),
    terminalText: document.querySelector('.terminal-text'),
    theoryContent: document.querySelector('.theory-content'),


}

//element Builder


function buildElement(parentElement, tagName, text, options = {} ){
    if(!parentElement) {
        console.error("Parent element is missing.")
        return null;
    }

    const el = document.createElement(tagName);
    
    if(text){
        el.textContent = text;

    }

    if (options.id){
        el.id = options.id;

    }

    if(options.className){
        el.className = options.className;


    }

    if(options.attributes){
        for (const[key, value] of Object.entries(options.attributes)){el.setAttribute(key, value)

        }
    }

    parentElement.appendChild(el);
    

    return el;
    
}
//element builder syntax


// buildElement(DOM.terminalContent, 'input', 'text', {
//     className: 'terminal-input',
//     attributes: {
//         type: 'text',
//         placeholder: 'Type a git command...',
//         autocomplete: 'off'
//     }
// }); 

const newDiv = buildElement(DOM.terminalContent, 'div', '', {
    className: 'terminal-input-line',
    attributes: {
        
    }
}
);

buildElement(newDiv, 'span', 'user@git-sim:~$ ', {
    className: 'prompt-text'
});

buildElement(newDiv, 'input', '', {
    className: 'terminal-input',
    attributes: {
        type: 'text',
        placeholder: 'type a git command here ... ',
        autocomplete: 'off'
    }
});

buildElement(newDiv, 'p', '', {
    className: 'terminal-output',

});
 
buildElement(DOM.theoryContent, 'h1', 'Understanding Git Status', {
    className: 'currentChapterHeader',


});

buildElement(DOM.theoryContent, 'p', 'When you type a command in the terminal on the left, this panel will explain the underlying theory, while the center panel maps out the commits visually.',
     {
    className: 'terminal-output-text',

});