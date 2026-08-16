//selectors
const DOM = {
    terminalContent: document.querySelector('.terminal-content'),
    terminalText: document.querySelector('.terminal-text'),

}



DOM.terminalContent.appendChild(terminalInputLine);

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