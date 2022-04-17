import { getAccess, refresh } from "./accessHandler.js";
import { message } from "./message.js";

export async function getTracks(playlistId) {
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

export async function addTracks(trackList, listId) {
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
      //msg.innerHTML = "Playlist updated successfully!";
      message("Playlist updated successfully!");
    }
  } catch (err) {
    console.log(err);
  }
}
