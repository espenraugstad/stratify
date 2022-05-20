import { header } from "./modules/header.js";
import { getPlaylists } from "./modules/playlistHandler.js";
import { getTracks } from "./modules/trackHandler.js";

window.onload = async ()=>{
    header();
    await populatePlaylists(0);
}

const inp1 = document.getElementById('inp1');
const btn1 = document.getElementById('btn1');
const songs = document.getElementById('songs');

let tracks = null;


btn1.addEventListener('click', async ()=>{
    tracks = await getTracks(inp1.value);
    console.log(tracks);
    songs.innerHTML = "";
    for(const song of tracks){
        let songDiv = document.createElement('div');
        songDiv.classList.add("dev-songs");
        
        let albumImg = new Image();
        albumImg.src = song.track.album.images[2].url;
        songDiv.appendChild(albumImg);

        let namesDiv = document.createElement('div');
        namesDiv.classList.add('dev-names-div');

        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = song.track.name;
        namesDiv.appendChild(titleDiv);

        let artistDiv = document.createElement('div');
        let artists = "";
        for(const artist of song.track.artists){
            //console.log(artist);
            artists += ` ${artist.name}, `;
        }
        artists = artists.trim();
        artists = artists.slice(0,-1);
        artistDiv.innerHTML = artists;
        namesDiv.appendChild(artistDiv);

        songs.appendChild(songDiv);
        songDiv.appendChild(namesDiv);
        
        let thisTrack = song;
        songDiv.addEventListener('click', ()=>{
            console.log(thisTrack);
        });

    }
});

async function populatePlaylists(offset){
    let playlists = await getPlaylists(offset);

    for(const list of playlists.items){
        //console.log(list);
        let newOption = document.createElement('option');
        newOption.value = list.id;
        newOption.text = list.name;
        inp1.appendChild(newOption);
    }

    if(playlists.items.length >= 50){
        populatePlaylists(offset + 50);
    }
}