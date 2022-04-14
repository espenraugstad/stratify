import { getCurrentUser } from "./modules/users.js";
import { logout } from "./modules/logout.js";

const user = document.getElementById("user");

getCurrentUser().then((userName) => {
  user.innerHTML = userName;
});


document.getElementById("logoutBtn").addEventListener("click", logout);