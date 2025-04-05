//Para filtrar por tipo de evento
document.addEventListener("DOMContentLoaded", function () {
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
                //Si la categoria no coincide, la ocultamos
                noticia.style.display = "none";
            }
        });

        //Si no hay resultados, añadimos el atributo "display: none;", si hay, añadimos los atributos de la frase
        if (hayResultados) {
            mensajeSinNoticias.setAttribute("style", "display: none;");

        } else {
            mensajeSinNoticias.setAttribute("style", "display: block; text-align: center; color: var(--color-azul1); font-size: 1.5rem; margin-top: 2rem;");
        }
    }

    //Ejecutamos la función una vez al cargar la página para que oculte el mensaje si hay noticias
    actualizarNoticias();

    //También ejecutamos la función cuando el usuario cambie el filtro
    filtroNoticias.addEventListener("change", actualizarNoticias);
});
