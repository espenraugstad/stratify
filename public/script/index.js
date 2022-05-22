import {mode} from './modules/modeToggle.js';
import { getAccessToken } from './modules/accessHandler.js';

// Login-button
const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', ()=>{
    location.href="/login";
});

// If the url contains the code, use it to get an access token
window.onload = ()=>{
    // Set the mode to dark by default
    if (window.location.search.length > 0) {
        getAccessToken();
      }
}
