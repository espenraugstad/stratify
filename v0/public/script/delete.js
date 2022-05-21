import { header } from "./modules/header.js";
import { message } from "./modules/message.js";
import { getPlaylists, deletePlaylists } from "./modules/playlistHandler.js";

window.onload = async function () {
  header();
  await fetchPlaylists(0);
  listPlaylists(0);
  
};

let playlists = [];
const playlistsDiv = document.getElementById("playlists");
const playlistsToDelete = document.getElementById("playlists-to-delete");
let listsToDelete = [];
const deleteListsBtn = document.getElementById('deleteListsBtn');

async function fetchPlaylists(offset){
  let playlistBatch = await getPlaylists(offset);
  playlists = playlists.concat(playlistBatch.items);
  if(playlistBatch.items.length >= 50){
    await fetchPlaylists(offset + 50);
  }
  return true;
}

async function listPlaylists(offset) {
  if (offset === 0) {
    playlistsDiv.innerHTML = "";
  }

  if(listsToDelete.length === 0){
      playlistsToDelete.innerHTML = "Selected lists will appear here. Click to remove a list.";
  }
  //let playlists = await getPlaylists(offset);

  for (let list of playlists) {
    let currentList = list;

    // Add all lists that are not to be deleted
    if (
      list.owner.id === localStorage.getItem("user") &&
      !listsToDelete.some((e) => e.id === currentList.id)
    ) {
      let listDiv = document.createElement("div");
      let listName = document.createElement("span");
      let listOwner = document.createElement("span");

      listName.innerHTML = list.name;
      listOwner.innerHTML = list.owner.display_name;
      listDiv.appendChild(listName);
      listDiv.appendChild(listOwner);
      listDiv.classList.add("playlist-list");
      playlistsDiv.appendChild(listDiv);

      listDiv.addEventListener("click", () => {
        // If the list is not in array of lists to delete, add it, else, do nothing
        if (!listsToDelete.some((e) => e.id === currentList.id)) {
          listsToDelete.push(currentList);
          playlistsToDelete.innerHTML = "";
          listPlaylists(0);
        }
      });
    }

    // Add playlists to be deleted in the other column
    if (
      list.owner.id === localStorage.getItem("user") &&
      listsToDelete.some((e) => e.id === currentList.id)
    ) {
      let deleteDiv = document.createElement("div");
      let deleteName = document.createElement("span");
      let deleteOwner = document.createElement("span");

      deleteName.innerHTML = list.name;
      deleteOwner.innerHTML = list.owner.display_name;
      deleteDiv.appendChild(deleteName);
      deleteDiv.appendChild(deleteOwner);
      deleteDiv.classList.add("playlist-list");
      playlistsToDelete.appendChild(deleteDiv);

      deleteDiv.addEventListener('click', ()=>{
          
          listsToDelete = listsToDelete.filter(list => list.id !== currentList.id);
          playlistsToDelete.innerHTML = "";
          listPlaylists(0);
      })
    }
  }
}

deleteListsBtn.addEventListener('click', async ()=>{
    if(listsToDelete.length === 0){
        message("Select one or more lists to delete by clicking a list in the left column.", false);
    } else {
        let messageText = "";
        if(listsToDelete.length === 1){
            messageText = "Are you sure you want to delete 1 playlist? This action can't be undone!";
        } else {
            messageText = `Are you sure you want to delete ${listsToDelete.length} playlists? This action can't be undone!`;
        }
        let reallyDelete = await message(messageText, true);
        
        if(reallyDelete){
            let deleted = await deletePlaylists(listsToDelete);
            if(deleted){
                listsToDelete = [];
                playlists = [];
                await fetchPlaylists(0);
                listPlaylists(0);
            } else {
                message("An error occured. Check the console.", false);
            }
        }
    }


});