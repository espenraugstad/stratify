import { getAccess } from "./accessHandler.js";

let allPlaylists = [];

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
    allPlaylists.push(...data.items);
    if (data.items.length >= 50) {
      await getPlaylists(offset + 50);
    }
    return allPlaylists;
  } catch (err) {
    console.log(err);
  }
}
