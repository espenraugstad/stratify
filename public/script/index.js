import { header } from "./modules/header.js";
import { getAccessToken } from './modules/accessHandler.js';

window.onload = ()=>{
    // Set header
    header();

    // Check to see if the url contains the code to login
    if (window.location.search.length > 0) {
        // Get access token.
        getAccessToken();
      }
}

document.getElementById('login').addEventListener('click', ()=>{
    // Go to the login endpoint on the server
    location.href = '/login';
});