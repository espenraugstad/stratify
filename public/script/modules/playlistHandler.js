import { getAccess, refresh } from "./accessHandler.js";

export async function deletePlaylists(listsToDelete){
  for(let list of listsToDelete){
    console.log(list.id);
    const url = `https://api.spotify.com/v1/playlists/${list.id}/followers`;

    const cfg = {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + getAccess(),
      }
    };

    try{
      let response = await fetch(url, cfg);
      if(response.status !== 200){
        throw `Could not delete playlist ${list.name}, error ${response.status}`;
      
      }
    } catch (err){
      console.log(err);
      return false;
    }
  }
  return true;
}

export async function createPlaylist(name) {
  console.log("Creating playlist " + name);

  const user = localStorage.getItem("user");

  const url = `https://api.spotify.com/v1/users/${user}/playlists`;

  const cfg = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Bearer " + getAccess(),
    },
    body: JSON.stringify({
      name: name,
    }),
  };

  try {
    let res = await fetch(url, cfg);
    if (res.status === 401) {
      refresh();
    }
    let data = await res.json();
    //return true;
    return data;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function getPlaylists(offset) {
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
    return data;
  } catch (err) {
    console.log(err);
  }
}
