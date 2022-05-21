export function logout(){
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  
    window.location.replace("index.html");
    window.location.href = "index.html";
    
}

