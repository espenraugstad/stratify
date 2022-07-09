export function header() {
  // Toggle dark/light-mode
  // TODO: Set default to system preference by using
  /*
    window.matchMedia('(prefers-color-scheme: dark)');
    */

  // Select the element to toggle the mode
  const mode = document.querySelector(".mode");
  mode.addEventListener("click", () => {
    const body = document.querySelector("body");
    body.classList.toggle("dark");
    if (body.classList.contains("dark")) {
      // Change mode icon to opposite
      mode.src = "./assets/lightmode.png";

      // Change placeholder image TODO: Only run this if user is not logged in
      document.querySelector(".menu-img").src =
        "./assets/placeholder_on_dark.png";

      // Change logo
      document.querySelector(".logo-img").src = "./assets/logo_on_dark.png";
    } else {
      // Change mode icon to opposite
      mode.src = "./assets/darkmode.png";

      // Change placeholder image TODO: Only run this if user is not logged in
      document.querySelector(".menu-img").src =
        "./assets/placeholder_on_light.png";

      // Change logo
      document.querySelector(".logo-img").src = "./assets/logo_on_light.png";
    }
  });

  // Mobile menu
  const primaryMenu = document.querySelector(".primary-menu");
  // Show mobile menu
  const menuImg = document.querySelector(".menu-img");
  menuImg.addEventListener("click", () => {
    const vis = primaryMenu.getAttribute("mobile-visible");
    if (vis === "false" && window.screen.width <= 500) {
      primaryMenu.setAttribute("mobile-visible", true);
    } else {
      console.log("Not relevant");
    }
  });

  // Close mobile menu
  const mobileMenuClose = document.querySelector(".mobile-menu-close");
  mobileMenuClose.addEventListener("click", () => {
    console.log("close");
    const vis = primaryMenu.getAttribute("mobile-visible");
    if (vis === "true") {
      primaryMenu.setAttribute("mobile-visible", false);
    } else {
      console.log("An error occured");
    }
  });
}
