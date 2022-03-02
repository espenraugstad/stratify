// HTML-elements
const currentUser = document.getElementById("currentUser");
const logout = document.getElementById("logout");
const followedPlaylists = document.getElementById("followedPlaylists");
const ownedPlaylists = document.getElementById("ownedPlaylists");
const followed = document.getElementById("followed");
const owned = document.getElementById("owned");
const copyBtn = document.getElementById("copyBtn");
const msg = document.getElementById("msg");


// Access token
let access = null;

function checkAccess(){
  access = localStorage.getItem("access");
  if (access && access !== "undefined") {
    return;
  } else {
    window.location.href = "index.html";
  }
}

window.onload = function() {
  checkAccess();
  getCurrentUser();
  getPlaylists(0);
}


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
});

async function getPlaylists(offset) {
  const url = `https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=50`;

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
    }
    let data = await res.json();

    for (list of data.items) {
      let opt = document.createElement("option");
      opt.value = list.id;
      opt.text = `${list.name} by ${list.owner.display_name}`;

      if (list.owner.id !== localStorage.getItem("user")) {
        opt.text = `${list.name} by ${list.owner.display_name}`;
        followed.add(opt, null);
      } else {
        opt.text = `${list.name}`;
        owned.add(opt, null);
      }
    }

    if (data.items.length >= 50) {
      getPlaylists(offset + 50);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getCurrentUser() {
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
      currentUser.innerHTML = `Welcome ${data.display_name}`;
    } else {
      throw "Unable to get current user";
    }
  } catch (err) {
    console.log(err);
  }
}

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
        Authorization: "Bearer " + access,
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

  // Get all tracks in the from-list
  for (item of fromList) {
    fromTracks.push(item.track.uri);
  }

  // Get all tracks in the to list
  for (item of toList) {
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
  console.log(trackList);
  const url = `https://api.spotify.com/v1/playlists/${listId}/tracks`;

  const cfg = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + access,
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
      localStorage.setItem("access".data.access_token);
      window.location.href = "dashboard.html";
    } else {
      throw data.error;
    }
  } catch (err) {
    console.log("Unable to get refresh token");
    console.log(err);
  }
}

// Log out
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");

  let backlen = history.length;
  history.go(-backlen);
  window.location.href = "index.html";
});
