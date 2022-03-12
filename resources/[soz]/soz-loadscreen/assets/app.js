const app = document.getElementById('app')
const musique = app.querySelector('audio')

musique.volume = 0.2

document.querySelector('.info').addEventListener('click', function () {
    if (musique.paused) {
        musique.play()
        app.querySelector('.play').style.display = 'block'
        app.querySelector('.pause').style.display = 'none'
    } else {
        musique.pause()
        app.querySelector('.play').style.display = 'none'
        app.querySelector('.pause').style.display = 'block'
    }
})

window.addEventListener('message', function(e) {
    if (e.data.eventName === 'initFunctionInvoking' && e.data.name === 'FinalizeLoad') {
        document.getElementById('video').style.opacity = '0'
        musique.pause()
    }
});
