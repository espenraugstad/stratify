import { header } from "./modules/header.js";
import { message } from "./modules/message.js";
import { getPlaylists, createPlaylist } from "./modules/playlistHandler.js";
import { addTracks, getTracks } from "./modules/trackHandler.js";

const newRandomName = document.getElementById("new-random-name");
const newRandomNum = document.getElementById("new-random-num");
const createNewRandom = document.getElementById("create-new-random");

let playlists = [];

window.onload = function () {
  newRandomName.value = "";
  newRandomNum.value = "";
  header();
};

createNewRandom.addEventListener("click", async () => {
  //console.log(`Creating playlist named ${newRandomName.value} with ${newRandomNum.value} songs.`);

  if (newRandomName.value === "") {
    message("Enter name of playlist.", false);
    return;
  }

  if (newRandomNum.value === "") {
    message("Enter a proper number.", false);
    return;
  }

  let newName = newRandomName.value;
  let numOfSongs = parseInt(newRandomNum.value);

  // Step 1, fetch all playlists
  await fetchPlaylists(0);
  console.log(playlists);

  let songCoords = [];
  let allSongCoords = [];

  for (let i = 0; i < playlists.length; i++) {
    for (let j = 0; j < playlists[i].tracks.total; j++) {
      allSongCoords.push({
        playlistIndex: i,
        songIndex: j,
      });
    }
  }

  // If the number of songs desired in the new playlist, set number of songs equal to the total number of songs
  if(numOfSongs > allSongCoords.length){
      numOfSongs = allSongCoords.length;
  }

  for (let k = 0; k < numOfSongs; k++) {
    let newSong = allSongCoords.splice(
      Math.floor(Math.random() * allSongCoords.length),
      1
    );

    //console.log(newSong);

    /*
    
    songCoords = [{
        playlistIndex: <Number>,
        songs: [<Number>]
    }]
    
    */
    let index = songCoords.findIndex(
      (e) => e.playlistIndex === newSong[0].playlistIndex
    );

    if (index === -1) {
      songCoords.push({
        playlistIndex: newSong[0].playlistIndex,
        songs: [newSong[0].songIndex],
      });
    } else {
      songCoords[index].songs.push(newSong[0].songIndex);
    }
  }

  //console.log(playlists);
  console.log(songCoords);

  // Get all the songs to add to the new playlist
  let tracks = [];
  for(let i = 0; i < songCoords.length; i++){
      let currentPlaylistIndex = songCoords[i].playlistIndex;
      let currentPlaylistId = playlists[currentPlaylistIndex].id;
      let currentTracks = await getTracks(currentPlaylistId);

      for(let j = 0; j < songCoords[i].songs.length; j++){
          tracks.push(currentTracks[songCoords[i].songs[j]].track.uri);
      }
  }

  console.log(tracks);

  // Create the new playlist
  let newlyCreatedPlaylist = await createPlaylist(newName);
  //console.log(newlyCreatedPlaylist.id);

  // Add all the songs to the new playlist
  let tracksAdded = await addTracks(tracks, newlyCreatedPlaylist.id);

  if(tracksAdded){
      message("Playlist created!", false);
  } else {
      message("Something went wrong. Check the console.", false);
  }

});

async function fetchPlaylists(offset) {
  let playlistBatch = await getPlaylists(offset);
  playlists = playlists.concat(playlistBatch.items);
  if (playlistBatch.items.length >= 50) {
    await fetchPlaylists(offset + 50);
  }
  return true;
}
