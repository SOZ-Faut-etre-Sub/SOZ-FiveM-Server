const app = document.getElementById('app');
const musique = app.querySelector('audio');
const volume = app.querySelector('#volume');
const VOLUME_MAX_MULT = 0.8;

function getVolume() {
    return localStorage.getItem('sozLoadScreenVolume') || 100
}
function setVolume(volume) {
    localStorage.setItem('sozLoadScreenVolume', volume);
    musique.volume = (volume / 100) * VOLUME_MAX_MULT;
}

function bootstrap() {
    // Load volume from localStorage
    musique.volume = (getVolume() / 100) * VOLUME_MAX_MULT;
    volume.value = getVolume();

    // Change volume
    volume.addEventListener('input', (event) => {
      setVolume(event.currentTarget.value);
    });

    musique.play()
}

window.addEventListener('message', function(e) {
    if (e.data.eventName === 'initFunctionInvoking' && e.data.name === 'FinalizeLoad') {
        document.getElementById('video').style.opacity = '0';

        setInterval(function () {
            if (musique.volume > 0.01) {
                musique.volume -= 0.01;
            }
        }, 50);
    }
});

bootstrap();
