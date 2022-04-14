import { getCurrentUser, getUser } from "./modules/users.js";
import { getAccess, checkAccess } from "./modules/access.js";
import { logout } from "./modules/logout.js";

// HTML-elements
const user = document.getElementById('user');
/* const followedPlaylists = document.getElementById("followedPlaylists"); */
/* const latest = document.getElementById("latest"); */
/* const ownedPlaylists = document.getElementById("ownedPlaylists"); */
/* const followed = document.getElementById("followed"); */
/* const owned = document.getElementById("owned"); */
const copyBtn = document.getElementById("copy-button");
/* const msg = document.getElementById("msg"); */

/* const copyFrom = document.getElementById('copy-from'); */
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

let copyIds = {
  from: '',
  to: '',
}

// Access token
/* let access = null;

function checkAccess() {
  access = localStorage.getItem("access");
  if (access && access !== "undefined") {
    return;
  } else {
    window.location.href = "index.html";
  }
} */

window.onload = function () {
  showAll.checked = false;
  /* copyFromLists.innerHTML = '';
  copyToLists.innerHTML = ''; */
  checkAccess();
  getPlaylists(0);
};

/* followed.addEventListener("change", async () => {
  let followedTracks = await getTracks(followed.selectedOptions[0].value);

  const lastTracks = 10;

  let latestTracks = followedTracks.slice(-lastTracks);

  let latestTracksOutput = "";

  for (track of latestTracks) {
    let added_by = await getUser(track.added_by.id);

    let songName = track.track.name;
    let artists = "";
    for (artist of track.track.artists) {
      artists += artist.name + ", ";
    }
    artists = artists.slice(0, -2);
    let addedDate = new Date(track.added_at);
    latestTracksOutput += `${songName} by ${artists}, added ${
      YEAR[addedDate.getMonth()]
    } ${addedDate.getDate()}, ${addedDate.getFullYear()}. Added by ${
      added_by.display_name
    }<br>`;
  }
  latest.innerHTML = "<h3>Last tracks added</h3>" + latestTracksOutput;
});

copyBtn.addEventListener("click", async () => {
  checkAccess();
  msg.innerHTML = "";

  if (
    followed.selectedOptions[0].value !== "" &&
    owned.selectedOptions[0].value !== ""
  ) {
    let copyFrom = await getTracks(followed.selectedOptions[0].value);
    let copyTo = await getTracks(owned.selectedOptions[0].value);
    await copyList(copyFrom, copyTo, owned.selectedOptions[0].value);
  } else {
    msg.innerHTML = "Select two playlists";
  }
}); */

copyBtn.addEventListener('click', async ()=>{
  // Check to make sure you're not copying to the same list
  if(copyIds.from === copyIds.to){
    alert("Can't copy to the same list");
  }

  let copyFrom = await getTracks(copyIds.from);
  let copyTo = await getTracks(copyIds.to);
  await copyList(copyFrom, copyTo, copyIds.to);

});

// Show all list will include lists the user owns
showAll.addEventListener('change', ()=>{
  copyFromLists.innerHTML = '';
  copyToLists.innerHTML = '';
  getPlaylists(0);
});

async function getPlaylists(offset) {
  const url = `https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=50`;

  const cfg = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + getAccess(),
    },
  };

  try {
    let res = await fetch(url, cfg);
    if (res.status === 401) {
      refresh();
    }
    let data = await res.json();
    for (let list of data.items) {
      let listId = list.id;
      // Add list to copy from
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

      

      /* let opt = document.createElement("option");
      opt.value = list.id;
      opt.text = `${list.name} by ${list.owner.display_name}`;

      if (list.owner.id !== localStorage.getItem("user")) {
        opt.text = `${list.name} by ${list.owner.display_name}`;
        followed.add(opt, null);
      } else {
        opt.text = `${list.name}`;
        owned.add(opt, null);
      } */
    }

    if (data.items.length >= 50) {
      getPlaylists(offset + 50);
    }
  } catch (err) {
    console.log(err);
  }
}

/* async function getUser(user_id) {
  const url = `https://api.spotify.com/v1/users/${user_id}`;

  const cfg = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + getAccess(),
    },
  };

  try {
    let res = await fetch(url, cfg);
    if (res.status === 401) {
      refresh();
    } else if (res.status === 200) {
      let data = await res.json();
      return data;
    } else if (res.status === 404) {
      return { display_name: "Unknown" };
    } else {
      throw "Unable to get current user";
    }
  } catch (err) {
    console.log(err);
  }
}
 */
/* async function getCurrentUser() {
  const url = "https://api.spotify.com/v1/me";

  const cfg = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + access,
    },
  };

  try {
    let res = await fetch(url, cfg);
    if (res.status === 401) {
      refresh();
    } else if (res.status === 200) {
      let data = await res.json();
      localStorage.setItem("user", data.id);
      currentUser.innerHTML = `${data.display_name}`;
    } else {
      throw "Unable to get current user";
    }
  } catch (err) {
    console.log(err);
  }
} */

async function getTracks(playlistId) {
  let max = false;
  let offset = 0;
  let tracks = [];

  while (!max) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?offset=${offset}`;
    const cfg = {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + getAccess(),
      },
    };

    try {
      let res = await fetch(url, cfg);
      if (res.status === 401) {
        refresh();
      } else if (res.status !== 200) {
        console.log(res.status);
        throw `Error ${res.status}`;
      } else {
        let data = await res.json();
        tracks = tracks.concat(data.items);
        if (data.items.length === 100) {
          offset += 100;
        } else {
          max = true;
          return tracks;
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
}

async function copyList(fromList, toList, toId) {
  let fromTracks = [];
  let toTracks = [];
  let copyTracks = [];
  console.log(fromList);

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
    for (track of fromTracks) {
      if (!toTracks.includes(track)) {
        copyTracks.push(track);
      }
    }
  } else {
    copyTracks = fromTracks;
  }

  if (copyTracks.length === 0) {
    msg.innerHTML = "Playlist already up to date.";
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

async function addTracks(trackList, listId) {
  //console.log(trackList);
  const url = `https://api.spotify.com/v1/playlists/${listId}/tracks`;

  const cfg = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + getAccess(),
    },
    body: JSON.stringify(trackList),
  };

  try {
    let res = await fetch(url, cfg);
    if (res.status === 401) {
      refresh();
    } else if (res.status !== 201) {
      console.log(res.status);
      throw `Error adding tracks ${res.status}`;
    } else {
      msg.innerHTML = "Playlist updated successfully!";
    }
  } catch (err) {
    console.log(err);
  }
}

// Get refresh-token
async function refresh() {
  const refreshToken = localStorage.getItem("refresh");
  const url = "/refreshToken";
  const cfg = {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ token: localStorage.getItem("refresh") }),
  };

  try {
    let res = await fetch(url, cfg);
    let data = await res.json();
    if (res.status === 200) {
      localStorage.setItem("access",data.access_token);
      window.location.href = "dashboard.html";
    } else {
      throw data.error;
    }
  } catch (err) {
    console.log("Unable to get refresh token");
    console.log(err);
  }
}

getCurrentUser().then((userName) => {
  user.innerHTML = userName;
});
document.getElementById("logoutBtn").addEventListener("click", logout);
