import { getCurrentUser } from "./modules/userHandler.js";
import { getAccess, checkAccess, refresh } from "./modules/accessHandler.js";
import { logout } from "./modules/logout.js";
import { message } from "./modules/message.js";
import { getPlaylists } from "./modules/playlistHandler.js";
import { getTracks, addTracks } from "./modules/trackHandler.js";

// HTML-elements
const user = document.getElementById('user'); 
const copyBtn = document.getElementById("copy-button");
const copyFromLists = document.getElementById('copy-from-lists');
const copyToLists = document.getElementById('copy-to-lists');
const showAll = document.getElementById('show-all');

// Global variables and constants
const YEAR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Ids for playlists to copy from and to
let copyIds = {
  from: '',
  to: '',
}

window.onload = function () {
  showAll.checked = false;

  checkAccess();
  listPlaylists(0);
};

copyBtn.addEventListener('click', async ()=>{
  
  // Check to make sure two playlists are selected
  if(copyIds.from === "" || copyIds.to === ""){
    message("Select two playlists!");
    return;
  } 

  // Check to make sure you're not copying to the same list
  if(copyIds.from === copyIds.to){
    message("Can't copy to the same playlist!");
    return;
  }

  let copyFrom = await getTracks(copyIds.from);
  let copyTo = await getTracks(copyIds.to);
  await copyList(copyFrom, copyTo, copyIds.to);

});

// Show all list will include lists the user owns
showAll.addEventListener('change', ()=>{
  copyFromLists.innerHTML = '';
  copyToLists.innerHTML = '';
  //getPlaylists(0);
  listPlaylists(0);
});

async function listPlaylists(offset){
  let playlists = await getPlaylists(offset);
  for (let list of playlists.items) {
    let listId = list.id;

    // Add all playlists in the copy from column
    if(showAll.checked || list.owner.id !== localStorage.getItem("user")){
      let newFromDiv = document.createElement('div');
    
      let listName = document.createElement('span');
      let listOwner = document.createElement('span');

      listName.innerHTML = list.name;
      listOwner.innerHTML = list.owner.display_name;
      newFromDiv.appendChild(listName);
      newFromDiv.appendChild(listOwner);
      newFromDiv.classList.add('playlist-list');
      copyFromLists.appendChild(newFromDiv);


      newFromDiv.addEventListener('click', (e)=>{
        copyIds.from = listId;

        // Remove any existing selected-classes
        let currentlySelected = document.querySelectorAll('.selected-playlist-from');
        currentlySelected.forEach(e => e.classList.remove('selected-playlist-from'));

        // Add selected class for this particular playlist
        newFromDiv.classList.add('selected-playlist-from');
      });
    }


    // Add only owners lists to copy to
    if(list.owner.id === localStorage.getItem("user")){
      let newToDiv = document.createElement('div');
    
      let listName = document.createElement('span');
      let listOwner = document.createElement('span');

      listName.innerHTML = list.name;
      listOwner.innerHTML = list.owner.display_name;
      newToDiv.appendChild(listName);
      newToDiv.appendChild(listOwner);
      newToDiv.classList.add('playlist-list');
      copyToLists.appendChild(newToDiv);

      newToDiv.addEventListener('click', (e)=>{
        copyIds.to = listId;

        // Remove any existing selected-classes
        let currentlySelected = document.querySelectorAll('.selected-playlist-to');
        currentlySelected.forEach(e => e.classList.remove('selected-playlist-to'));

        // Add selected class for this particular playlist
        newToDiv.classList.add('selected-playlist-to');
      });
    }
  }

  // List more playlists if there are more than 50
  if (playlists.items.length >= 50) {
    listPlaylists(offset + 50);
  }
}

async function copyList(fromList, toList, toId) {
  let fromTracks = [];
  let toTracks = [];
  let copyTracks = [];

  // Get all tracks in the from-list
  for (let item of fromList) {
    fromTracks.push(item.track.uri);
  }

  // Get all tracks in the to list
  for (let item of toList) {
    toTracks.push(item.track.uri);
  }

  // Compare lists (if the to-list is not empty)
  if (toTracks.length > 0) {
    for (let track of fromTracks) {
      if (!toTracks.includes(track)) {
        copyTracks.push(track);
      }
    }
  } else {
    copyTracks = fromTracks;
  }

  if (copyTracks.length === 0) {
    //msg.innerHTML = "Playlist already up to date.";
    message("Playlist already up to date.");
    return;
  } else {
    // Max 100 tracks to add at once
    if (copyTracks.length > 100) {
      // Add chunks of 100 to the array
      for (let i = 0; i < copyTracks.length; i += 100) {
        //console.log(copyTracks.slice(i, i + 100));
        await addTracks(copyTracks.slice(i, i + 100), toId);
      }
    } else {
      await addTracks(copyTracks, toId);
    }
  }
}

getCurrentUser().then((userName) => {
  user.innerHTML = userName;
});
document.getElementById("logoutBtn").addEventListener("click", logout);
