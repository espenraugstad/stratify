export function message(messageText){
    const header = document.querySelector('header');
    const container = document.querySelector('.container');

    // Create a new div for the modal window
    let messageBox = document.createElement('div');
    
    // Add styles to the message box:
    messageBox.style.zIndex = "10000";
    messageBox.style.padding = "4rem";
    messageBox.style.backgroundColor = "#575757";
    messageBox.style.position = "fixed";
    messageBox.style.top = "200px";
    messageBox.style.left = "calc(50vw - 250px)";
    messageBox.style.width = "fit-content";
    messageBox.style.display = "flex";
    messageBox.style.flexDirection = "column";
    messageBox.style.justifyContent = "center";
    messageBox.style.alignItems = "center";
    messageBox.style.fontSize = "20pt";
    messageBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    
    // Add content to the message box
    messageBox.innerHTML = messageText;
    
    // Add dismissbutton
    let dismissBtn = document.createElement('button');
    dismissBtn.style.marginTop = "2rem";
    dismissBtn.innerHTML = "OK";
    messageBox.appendChild(dismissBtn);

     // Fade out other elements
    header.style.filter = "opacity(0.2)";
    container.style.filter = "opacity(0.2)";

    // Add message box to body
    document.body.prepend(messageBox);
    messageBox.style.filter = "none";

   

    messageBox.addEventListener('click', ()=>{
        header.style.filter = "none";
        container.style.filter = "none";
        messageBox.remove();
        
    });
}