import { header } from "./modules/header.js";
import { getMode, mode } from "./modules/modeToggle.js";
import { getPlaylists } from "./modules/playlistHandler.js";

const allLists = document.getElementById("all-lists");
const selector = document.getElementById("selector");
const selectTarget = document.getElementById("select-target");
const merge = document.getElementById('merge');

let allPlaylists = null;
let listsToMerge = [];

window.onload = async () => {
  getMode();
  header();
  allPlaylists = await getPlaylists(0);
  populateDiv();
  populateSelect();
};

allLists.addEventListener("change", () => {
  populateDiv();
});

function populateDiv() {
  const playlistDiv = document.getElementById("playlists-div");
  playlistDiv.innerHTML = "";
  for (let list of allPlaylists) {
    let listDiv = document.createElement("div");
    listDiv.classList.add("primary-container-unselected");
    let listName = document.createElement("span");
    listName.innerHTML = `<h3>${list.name}</h3>`;
    let listOwner = document.createElement("span");
    listOwner.innerHTML = list.owner.display_name;
    listDiv.appendChild(listName);
    listDiv.appendChild(listOwner);

    if (allLists.checked) {
      playlistDiv.appendChild(listDiv);
    } else if (list.owner.id !== localStorage.getItem("user")) {
      playlistDiv.appendChild(listDiv);
    }

    let listId = list.id;
    listDiv.addEventListener("click", () => {
      // Add/remove selected class
      listDiv.classList.toggle("primary-container-selected");
      listDiv.classList.toggle("primary-container-unselected");

      // Add/remove this id from array of lists to merge
      // If this list does not exist in the array, add it, else remove it.
      if (listsToMerge.includes(listId)) {
        listsToMerge.splice(listsToMerge.indexOf(listId), 1);
      } else {
        listsToMerge.push(listId);
      }

    });
  }
}

function populateSelect() {

  for (let list of allPlaylists) {
    let targetOptn = document.createElement("div");
    targetOptn.setAttribute("id", list.id);
    targetOptn.classList.add("hidden");
    targetOptn.classList.add("target-option");
    targetOptn.innerHTML = list.name;
    selector.appendChild(targetOptn);

    targetOptn.addEventListener("click", (t) => {
      selectTarget.classList.add("hidden");
      let hiddenElements = document.querySelectorAll(".target-option");

      for (let e of hiddenElements) {
        if (e.id !== t.target.id) {
          e.classList.toggle("hidden");
        }
      }
    });
  }
}

selectTarget.addEventListener("click", () => {
  let hiddenElements = document.querySelectorAll(".target-option");
  for (let e of hiddenElements) {
    e.classList.toggle("hidden");
  }
});

merge.addEventListener('click', ()=>{
   console.log('merge'); 
   console.log(listsToMerge);
   // TODO: Find a way to target the target list.
});