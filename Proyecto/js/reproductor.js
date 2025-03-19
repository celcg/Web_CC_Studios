document.addEventListener("DOMContentLoaded", () => {
    const playIcon = document.getElementById("playIcon");
    const speakerIcon = document.getElementById("speakerIcon");
    const audio = document.getElementById("audio");
    const volumeControl = document.getElementById("volumeControl");

    // Reproducir o pausar la canción al hacer clic en Play
    playIcon.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playIcon.src = "../imagenes/reproductor/Pause.svg"; // Cambia a icono de pausa
        } else {
            audio.pause();
            playIcon.src = "../imagenes/reproductor/Play.svg"; // Vuelve a icono de play
        }
    });

    // Mostrar u ocultar el control de volumen al hacer clic en el altavoz
    speakerIcon.addEventListener("click", () => {
        if (volumeControl.style.display === "none") {
            volumeControl.style.display = "block";
        } else {
            volumeControl.style.display = "none";
        }
    });

    // Ajustar el volumen al mover el control
    volumeControl.addEventListener("input", () => {
        audio.volume = volumeControl.value;
    });
});
