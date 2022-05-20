export function inputMessage(messageText) {
  return new Promise((res, rej) => {
    const header = document.querySelector("header");
    const container = document.querySelector(".container");

    // Create a new div for the modal window
    let messageBox = document.createElement("div");

    // Add styles to the message box:
    messageBox.style.zIndex = "10000";
    messageBox.style.padding = "4rem";
    messageBox.style.backgroundColor = "#575757";
    messageBox.style.position = "fixed";
    messageBox.style.top = "6rem";
    messageBox.style.left = "50%";
    messageBox.style.transform = "translateX(-50%)";
    messageBox.style.maxWidth = "50vw";
    messageBox.style.minWidth = "25vw";
    messageBox.style.margin = "auto";
    messageBox.style.display = "flex";
    messageBox.style.flexDirection = "column";
    messageBox.style.justifyContent = "center";
    messageBox.style.alignItems = "center";
    messageBox.style.fontSize = "20px";
    messageBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

    // Add content to the message box
    messageBox.innerHTML = messageText;

    // Add the input area
    let input = document.createElement("input");

    input.style.marginTop = "1rem";
    input.style.height = "35px";
    input.style.fontSize = "18px";

    messageBox.appendChild(input);

    // Add the button area to the message box
    let btnArea = document.createElement("div");
    messageBox.appendChild(btnArea);

    btnArea.style.display = "flex";
    btnArea.style.width = "100%";

    // Add a cancel button
    let cancelBtn = document.createElement("button");

    cancelBtn.style.marginTop = "2rem";
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.classList.add("cancel");
    btnArea.appendChild(cancelBtn);
    btnArea.style.justifyContent = "space-around";

    // Add the OK button
    let okBtn = document.createElement("button");
    okBtn.style.marginTop = "2rem";
    okBtn.innerHTML = "OK";
    btnArea.appendChild(okBtn);

    // Fade out other elements
    header.style.filter = "opacity(0.2)";
    container.style.filter = "opacity(0.2)";

    // Add message box to body
    document.body.prepend(messageBox);
    messageBox.style.filter = "none";

    cancelBtn.addEventListener("click", () => {
      header.style.filter = "none";
      container.style.filter = "none";
      messageBox.remove();
      res("");
    });

    okBtn.addEventListener("click", () => {
      header.style.filter = "none";
      container.style.filter = "none";
      messageBox.remove();
      if(input.value === ""){
          rej();
      } else {
        res(input.value);
      }
      
    });
  });
}

export function message(messageText, cancel) {
  return new Promise((res, rej) =>{
    const header = document.querySelector("header");
  const container = document.querySelector(".container");

  // Create a new div for the modal window
  let messageBox = document.createElement("div");

  // Add styles to the message box:
  messageBox.style.zIndex = "10000";
  messageBox.style.padding = "4rem";
  messageBox.style.backgroundColor = "#575757";
  messageBox.style.position = "fixed";
  messageBox.style.top = "6rem";
  messageBox.style.left = "50%";
  messageBox.style.transform = "translateX(-50%)";
  messageBox.style.maxWidth = "50vw";
  messageBox.style.minWidth = "25vw";
  messageBox.style.margin = "auto";
  messageBox.style.display = "flex";
  messageBox.style.flexDirection = "column";
  messageBox.style.justifyContent = "center";
  messageBox.style.alignItems = "center";
  messageBox.style.fontSize = "20px";
  messageBox.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";

  // Add content to the message box
  messageBox.innerHTML = messageText;

  // Add the button area to the message box
  let btnArea = document.createElement("div");
  messageBox.appendChild(btnArea);

  btnArea.style.display = "flex";
  btnArea.style.width = "100%";

  let cancelBtn = document.createElement("button");
  if (cancel) {
    // Add a cancel button
    cancelBtn.style.marginTop = "2rem";
    cancelBtn.innerHTML = "Cancel";
    cancelBtn.classList.add("cancel");
    btnArea.appendChild(cancelBtn);
    btnArea.style.justifyContent = "space-around";
  } else {
    btnArea.style.justifyContent = "center";
  }

  // Add the OK button
  let okBtn = document.createElement("button");
  okBtn.style.marginTop = "2rem";
  okBtn.innerHTML = "OK";
  btnArea.appendChild(okBtn);

  // Fade out other elements
  header.style.filter = "opacity(0.2)";
  container.style.filter = "opacity(0.2)";

  // Add message box to body
  document.body.prepend(messageBox);
  messageBox.style.filter = "none";

  cancelBtn.addEventListener("click", () => {
    header.style.filter = "none";
    container.style.filter = "none";
    messageBox.remove();
    res(false);
  });

  okBtn.addEventListener("click", () => {
    header.style.filter = "none";
    container.style.filter = "none";
    messageBox.remove();
    res(true);
  });
  });
  
}
