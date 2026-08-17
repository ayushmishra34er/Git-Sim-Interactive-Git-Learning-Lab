
import { buildElement } from '../components/buildElement.js';
import { handleCommand } from '../engine/commandParser.js';


export function setupTerminalEvents(DOM) {

    inputE1.addEventListener('keydown', function(e){

    if(e.key === 'Enter'){

       const userCommand = inputE1.value;


       buildElement(DOM.terminalContent, 'p', `user@git-sim:~$ ${userCommand}`, {
           className: 'terminal-output',
           attributes: { style: 'color: #00ff00;' } // Green to look like a prompt
       });


       const systemResponse = handleCommand(userCommand);
       if(systemResponse !== "") {
        buildElement(DOM.terminalContent, 'p', systemResponse, {
               className: 'terminal-output',
               attributes: { style: 'color: #ccc; white-space: pre-wrap;' } // Gray for system output
           });
       }
       

       inputE1.value = "";
       DOM.terminalContent.scrollTop = DOM.terminalContent.scrollHeight;
    
    }
    
});


DOM.terminalContent.addEventListener('click', function(e){
    console.log(e.target);

    const userClicked = e.target;
   userClickOutput.textContent = "You Clicked a: " + userClicked.tagName;
    
});




    
}