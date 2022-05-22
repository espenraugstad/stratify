import { getCurrentUser } from "./userHandler.js";

export function header() {
  const user = document.getElementById("user");
  getCurrentUser().then((userName) => {
      if(userName === ''){
        user.innerHTML = 'Not logged in';
      } else {
          user.innerHTML = userName;
      }
    
  });
  document.getElementById("logoutBtn").addEventListener("click", ()=>{
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  
    window.location.replace("index.html");
    window.location.href = "index.html";
  });
}
