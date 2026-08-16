//selectors
const DOM = {
    terminalContent: document.querySelector('.terminal-content'),
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


 const inputE1 = buildElement(newDiv, 'input', '', {
    className: 'terminal-input',
    attributes: {
        type: 'text',
        placeholder: 'type a git command here ... ',
        autocomplete: 'off'
    }
});



 
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

//event listeners 

inputE1.addEventListener('keydown', function(e){

    if(e.key === 'Enter'){

       const userCommand = inputE1.value;


         buildElement(DOM.terminalContent, 'p', userCommand, {
            className: 'terminal-output'
        })

   

       inputE1.value = "";

    

    }
    
});


DOM.terminalContent.addEventListener('click', function(e){
    console.log(e.target);

    const userClicked = e.target;
   userClickOutput.textContent = "You Clicked a: " + userClicked.tagName;
    
});



