import { getCurrentUser } from "./userHandler.js";

export async function header() {
  // Toggle dark/light-mode
  // TODO: Set default to system preference by using
  /*
    window.matchMedia('(prefers-color-scheme: dark)');
    */

  // Get current set mode
  getMode();

  // Select the element to toggle the mode
  const mode = document.querySelector(".mode");
  mode.addEventListener("click", () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
      localStorage.setItem("mode", "dark");
      // Change mode icon to opposite
      mode.src = "./assets/lightmode.png";

      // Change placeholder image TODO: Only run this if user is not logged in
      if (!localStorage.getItem("user")) {
        document.querySelector(".menu-img").src =
          "./assets/placeholder_on_dark.png";
      }

      // Change logo
      document.querySelector(".logo-img").src = "./assets/logo_on_dark.png";
    } else {
      localStorage.setItem("mode", "light");
      // Change mode icon to opposite
      mode.src = "./assets/darkmode.png";

      // Change placeholder image TODO: Only run this if user is not logged in
      if (!localStorage.getItem("user")) {
        document.querySelector(".menu-img").src =
          "./assets/placeholder_on_light.png";
      }

      // Change logo
      document.querySelector(".logo-img").src = "./assets/logo_on_light.png";
    }
  });

  // Mobile menu
  const primaryMenu = document.querySelector(".primary-menu");
  // Show mobile menu
  const menuId = document.querySelector(".menu-id");
  menuId.addEventListener("click", () => {
    const vis = primaryMenu.getAttribute("mobile-visible");
    if (vis === "false" && document.body.clientWidth <= 700) {
      primaryMenu.setAttribute("mobile-visible", true);
    } else {
      console.log("Not relevant");
    }
  });

  // Close mobile menu
  const mobileMenuClose = document.querySelector(".mobile-menu-close");
  mobileMenuClose.addEventListener("click", () => {
    const vis = primaryMenu.getAttribute("mobile-visible");
    if (vis === "true") {
      primaryMenu.setAttribute("mobile-visible", false);
    } else {
      console.log("An error occured");
    }
  });

  // Get the current user
  // Html elements
  const userName = document.querySelector(".user-name");
  const menuImg = document.querySelector(".menu-img");

  let user = await getCurrentUser();





  userName.innerHTML = user.display_name;
  menuImg.src = user.images[0].url;

  // Logout
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    window.location.replace("index.html");
    window.location.href = "index.html";
  });
}

function getMode() {
  const mode = document.querySelector(".mode");
  let currentMode = localStorage.getItem("mode");
  if (!currentMode) {
    return;
  }
  const body = document.querySelector("body");
  if ((currentMode === "dark")) {
    body.classList.add("dark");
    // Change mode icon to opposite
    mode.src = "./assets/lightmode.png";

    // Change placeholder image TODO: Only run this if user is not logged in
    if (!localStorage.getItem("user")) {
      document.querySelector(".menu-img").src =
        "./assets/placeholder_on_dark.png";
    }

    // Change logo
    document.querySelector(".logo-img").src = "./assets/logo_on_dark.png";
  } else {
    body.classList.remove('dark');
    // Change mode icon to opposite
    mode.src = "./assets/darkmode.png";

    // Change placeholder image TODO: Only run this if user is not logged in
    if (!localStorage.getItem("user")) {
      document.querySelector(".menu-img").src =
        "./assets/placeholder_on_light.png";
    }

    // Change logo
    document.querySelector(".logo-img").src = "./assets/logo_on_light.png";
  }
}
