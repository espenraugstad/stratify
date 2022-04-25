import { getCurrentUser } from "./modules/userHandler.js";
import { logout } from "./modules/logout.js";

const user = document.getElementById("user");

// Get the current username and put in the header
getCurrentUser().then((userName) => {
  user.innerHTML = userName;
});


document.getElementById("logoutBtn").addEventListener("click", logout);

const all = document.getElementById('all');
all.addEventListener('click', ()=>{
    location.href="all.html";
});

const deleteBtn = document.getElementById("delete");
deleteBtn.addEventListener('click', ()=>{
  location.href = "delete.html";
})