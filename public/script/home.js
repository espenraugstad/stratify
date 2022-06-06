import { header } from "./modules/header.js";
import { getMode, mode } from "./modules/modeToggle.js";

window.onload = () => {
  getMode();
  header();
};

document.getElementById("merge").addEventListener("click", () => {
  location.href = "merge2.html";
});

document.getElementById("delete").addEventListener("click", () => {
  console.log("delete");
});

document.getElementById("add").addEventListener("click", () => {
  console.log("add");
});
