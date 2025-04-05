document.addEventListener("DOMContentLoaded", async function () {
    try {
        const xml = await cargarXML("js/data/fichas.xml");
        mostrarArtistas(xml);
    } catch (error) {
        console.error("Error al cargar artistas:", error);
    }
});

function cargarXML(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseXML);
            } else {
                reject(`Error ${xhr.status}: ${xhr.statusText}`);
            }
        };
        xhr.onerror = () => reject("Error de red al cargar XML.");
        xhr.send();
    });
}

function mostrarArtistas(xml) {
    const artistas = xml.getElementsByTagName("artista");
    const contenedor = document.getElementById("fichas");

    for (let i = 0; i < artistas.length; i++) {
        const artista = artistas[i];
        const id = artista.getAttribute("id");
        const nombre = artista.getElementsByTagName("nombre")[0].textContent;
        const imagen = artista.getElementsByTagName("imagenLista")[0].textContent;

        const article = document.createElement("article");
        article.innerHTML = `
            <a href="ficha.html?artista=${encodeURIComponent(id)}">
                <figure class="artista">
                    <img src="${imagen}" alt="${nombre}">
                </figure>
                <figcaption>${nombre}</figcaption>
            </a>
        `;
        contenedor.appendChild(article);
    }
}
