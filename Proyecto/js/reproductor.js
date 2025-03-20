$(document).ready(function() {
    const $playIcon = $("#playIcon");
    const $speakerIcon = $("#speakerIcon");
    const $audio = $("#audio")[0]; // El objeto `audio` es un elemento HTML, así que usamos `[0]` para acceder al nodo real
    const $volumeControl = $("#volumeControl");
    const $tituloCancion = $("#tituloCancion");

    // Reproducir o pausar la canción al hacer clic en Play
    $playIcon.click(function() {
        if ($audio.paused) {
            $audio.play();
            $playIcon.attr("src", "../imagenes/reproductor/Pause.svg"); // Cambia a icono de pausa
        } else {
            $audio.pause();
            $playIcon.attr("src", "../imagenes/reproductor/Play.svg"); // Vuelve a icono de play
        }
    });

    // Mostrar u ocultar el control de volumen al hacer clic en el altavoz
    $speakerIcon.click(function() {
        if ($volumeControl.css("display") === "none") {
            $volumeControl.css("display", "block");
            $tituloCancion.prop("hidden", true); // Ocultar el título cuando el volumen esté visible
        } else {
            $volumeControl.css("display", "none");
            $tituloCancion.prop("hidden", false); // Mostrar el título cuando el volumen no esté visible
        }
    });

    // Ajustar el volumen al mover el control
    $volumeControl.on("input", function() {
        $audio.volume = $(this).val();
    });
});
