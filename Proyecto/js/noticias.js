//Para filtrar por tipo de evento CON LET ESTOY USANDO ES6, HAY QUE CAMBIAR
document.addEventListener("DOMContentLoaded", function () {
    // Obtener elementos del DOM
    const filtroNoticias = document.getElementById("filtroNoticias");
    const noticias = document.querySelectorAll(".noticias");
    const mensajeSinNoticias = document.getElementById("mensajeSinNoticias");


    function actualizarNoticias() {
        const filtro = filtroNoticias.value.toLowerCase();
        let hayResultados = false;

        noticias.forEach(noticia => {
            const categoria = noticia.querySelector("figcaption").textContent.toLowerCase();

            if (filtro === "todas" || categoria.includes(filtro)) {
                noticia.style.display = "flex";
                hayResultados = true;
            } else {
                noticia.style.display = "none";
            }
        });

        // Si no hay resultados, añadimos el atributo "display: none;", si hay, añadimos los atributos de la frase
        if (hayResultados) {
            mensajeSinNoticias.setAttribute("style", "display: none;");
        } else {
            mensajeSinNoticias.setAttribute("style", "display: block; text-align: center; color: var(--color-azul1); font-size: 1.5rem; margin-top: 2rem;");
        }
    }

    // Ejecutar la función una vez al cargar la página para que oculte el mensaje si hay noticias
    actualizarNoticias();

    // También ejecutar la función cuando el usuario cambie el filtro
    filtroNoticias.addEventListener("change", actualizarNoticias);
});
