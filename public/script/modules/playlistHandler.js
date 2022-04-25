import { getAccess, refresh } from "./accessHandler.js";

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
    return true;
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
