const body = document.querySelector('body');
const logo = document.getElementById('logo');
const mode = document.getElementById('mode');

mode.addEventListener('click', ()=>{
    console.log('clics');
    body.classList.toggle('light');
    if(body.classList.contains('light')){
        logo.src = '../imgs/logodarkCircle1.png';
        mode.innerHTML = 'dark_mode';
        localStorage.setItem('mode', 'light');
    } else {
        logo.src = '../imgs/logolightCircle1.png';
        mode.innerHTML = 'light_mode';
        localStorage.setItem('mode', 'dark');
    }
});

export function getMode(){
    const currentMode = localStorage.getItem('mode');
    if(currentMode === 'light'){
        logo.src = '../imgs/logodarkCircle1.png';
        mode.innerHTML = 'dark_mode';
        body.classList.add('light')
    } else {
        logo.src = '../imgs/logolightCircle1.png';
        mode.innerHTML = 'light_mode';
        body.classList.remove('light');
    }
}

export {mode};