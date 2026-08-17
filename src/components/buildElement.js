export function buildElement(parentElement, tagName, text, options = {} ){
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