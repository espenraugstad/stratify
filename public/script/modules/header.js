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
}
