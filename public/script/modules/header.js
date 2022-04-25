import { getCurrentUser } from "./userHandler.js";
import { logout } from "./logout.js";

export function header() {
  const user = document.getElementById("user");

  getCurrentUser().then((userName) => {
    user.innerHTML = userName;
  });
  document.getElementById("logoutBtn").addEventListener("click", logout);
}
