// Obtener los elementos del DOM
const playIcon = document.getElementById('playIcon');
const audio = document.getElementById('audio');

// Agregar el evento de clic al icono de Play
playIcon.addEventListener('click', function() {
    if (audio.paused) {
        audio.play(); // Reproducir la canción
        // Cambiar el ícono a pausa cuando la canción esté en reproducción
        playIcon.src = "../imagenes/reproductor/Pause.svg"; // Cambiar la imagen a pausa
    } else {
        audio.pause(); // Pausar la canción
        // Cambiar el ícono a play cuando la canción esté pausada
        playIcon.src = "../imagenes/reproductor/Play.svg"; // Cambiar la imagen a play
    }
});
