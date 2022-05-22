import { header } from './modules/header.js';
import { getMode, mode } from './modules/modeToggle.js';

window.onload = ()=>{
    getMode();
    header();
}