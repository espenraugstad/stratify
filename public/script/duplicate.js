import { header } from "./modules/header.js";
import { getPlaylists } from "./modules/playlistHandler.js";
import { getTracks } from "./modules/trackHandler.js";

window.onload = async () => {
    header();
    await fetchPlaylists(0);
}

const playlistSelector = document.getElementById('playlistSelector');
const foundDuplicates = document.getElementById('foundDuplicates');

async function fetchPlaylists(offset){
    let playlists = await getPlaylists(offset);
    for(const list of playlists.items){
        let newOption = document.createElement('option');
        newOption.value = list.id;
        newOption.text = list.name;
        playlistSelector.appendChild(newOption);
    }
    if(playlists.items.length >= 50){
        fetchPlaylists(offset + 50);
    }
}

const duplicatesBtn = document.getElementById('duplicatesBtn');
duplicatesBtn.addEventListener('click', async ()=>{
    // Reset the div
    foundDuplicates.innerHTML = "<h3>Tracks</h3><h3>Duplicates</h3>";

    // Find out which option is selected
    let radioOptions = document.querySelectorAll('input[name="options"]');
    
    let selectedOption = null;
    radioOptions.forEach(e => {
        if(e.checked){
            selectedOption = e;
            return;
        }
    });

    // Get all songs from the selected playlist in an array
    let tracks = await getTracks(playlistSelector.value);
    console.log(tracks);


    
    let duplicates = [];
    /*
    
    Options:
    if(selectedOption.id === "default") => only check for ids

    if(selectedOption.id === "songArtist") => check for ids OR song + artist
    
    */

    // Start by looping through the tracks array and remove every element found that mathces the duplication criteria

    let tempTracks = tracks;
    /* for(const track of tempTracks){
        console.log(track.track.id);
    } */

    



    /* for(const song of tracks){
        let checkedTracks = tracks.filter((track)=>{return filterTracks(song, track)});
        if(checkedTracks.length > 1){
            duplicates.push({
                case: checkedTracks
            });
        }
    } */

    /* function filterTracks(song, track){
        //console.log(compareArrays(song.track.artists,track.track.artists)); 
        if(selectedOption.id === "default"){
            return song.track.id === track.track.id;  
        } else if(selectedOption.id === "songArtist") {
            return (song.track.id === track.track.id || (song.track.name === track.track.name && compareArrays(song.track.artists,track.track.artists)));    
        } else {
            return false;
        }
    } */

    let uniqueDuplicates = [];
    for(const entry of duplicates){
        if(!uniqueDuplicates.some(el => {
            return el.case[0].track.id === entry.case[0].track.id
        })){
            //console.log('Unique entry found');
            uniqueDuplicates.push(entry);
        } 
    }

    displayDuplicates(uniqueDuplicates);
    
});

// Compare two arrays with objects, return true if they are identical, else, false
function compareArrays(arr1, arr2){
    
    if(arr1.length !== arr2.length){
        return false;
    }

    // Extract all artist ids from both arrays
    let arr1Artists = arr1.map(e => e.name);
    let arr2Artists = arr2.map(e => e.name);

    //Loop through first array and check if each element can be found in array 2.
    arr1Artists.forEach((artist) => {
        if(arr2Artists.some((a) => {
            console.log(`${a} and ${artist}`);
            return a === artist})){
            return true;
        }
    });

    return false;
   

    /* arr1.forEach((el1)=>{
        let found = arr2.findIndex((el2) =>{
            el2.name === el1.name;
        });

        if(found === -1){
            return false;
        } else {
            return true;
        }
    }); */

    /* console.log(arr1);
    console.log(arr2); */


}

function displayDuplicates(duplicates){
    
    if(duplicates.length === 0){
        foundDuplicates.innerHTML = "<h3>No duplicates found!</h3>";
    }

    for(const foundCase of duplicates){
        //console.log(foundCase.case[0].track.album.images[2].url);

        // Div for song info
        let songDiv = document.createElement('div');
        songDiv.classList.add('song');

        let albumImg = new Image();
        albumImg.src = foundCase.case[0].track.album.images[2].url;
        songDiv.appendChild(albumImg);

        let songNamesDiv = document.createElement('div');
        songNamesDiv.classList.add('song-names');

        let titleDiv = document.createElement('div');
        titleDiv.innerHTML = foundCase.case[0].track.name;
        
        let artistDiv = document.createElement('div');
        let artists = "";
        for(const artist of foundCase.case[0].track.artists){
            //console.log(artist);
            artists += ` ${artist.name}, `;
        }
        artists = artists.trim();
        artists = artists.slice(0,-1);
        artistDiv.innerHTML = artists;


        songNamesDiv.appendChild(titleDiv);
        songNamesDiv.appendChild(artistDiv);

        songDiv.appendChild(songNamesDiv);


        foundDuplicates.appendChild(songDiv);

        // Div for duplicates
        let duplicatesDiv = document.createElement('div');
        duplicatesDiv.classList.add('duplicateNumbers');
        duplicatesDiv.innerHTML = `&times;${foundCase.case.length}`;

        foundDuplicates.appendChild(duplicatesDiv);
    }
}