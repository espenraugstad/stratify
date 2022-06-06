import { header } from "./modules/header.js";
import { getMode, mode } from "./modules/modeToggle.js";
import { getPlaylists } from "./modules/playlistHandler.js";

const playlistsDivHeader = document.getElementById("playlists-div-header");
const playlistsDiv = document.getElementById("playlists-div");
const checkall = document.getElementById("checkall");
let allPlaylists = null;

window.onload = async () => {
  getMode();
  header();
  allPlaylists = await getPlaylists(0);
  populateDiv();
  console.log(allPlaylists);
};

function populateDiv() {
  // Clear playlists if some are already shown.
  playlistsDiv.innerHTML = "";

  for (let list of allPlaylists) {
    // Create a new div to contain info about a playlist
    let listDiv = document.createElement("div");

    // Name of playlist
    let listName = document.createElement("span");
    listName.innerHTML = `<h3>${list.name}</h3>`;

    // Who owns/created the playlist
    let listOwner = document.createElement("span");
    listOwner.innerHTML = list.owner.display_name;

    // Add all info to the playlist div
    listDiv.appendChild(listName);
    listDiv.appendChild(listOwner);

    // Add the playlist to the main div for playlists
    playlistsDiv.appendChild(listDiv);
  }
}

playlistsDivHeader.addEventListener("click", () => {
  playlistsDiv.classList.toggle("hidden");
  checkall.classList.toggle("hidden");
});
