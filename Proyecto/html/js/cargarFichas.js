document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Cargar XML y JSON de manera paralela
        const results = await Promise.allSettled([
            cargarXML("js/data/fichas.xml"),
            cargarJSON("js/data/eventos.json")
        ]);

        // Verificar los resultados de cada promesa
        const xmlResult = results[0];
        const jsonResult = results[1];

        if (xmlResult.status === "fulfilled") {
            procesarXML(xmlResult.value);
        } else {
            console.error("Fallo al cargar el XML:", xmlResult.reason);
        }

        if (jsonResult.status === "fulfilled") {
            procesarJSON(jsonResult.value);
        } else {
            console.error("Fallo al cargar el JSON:", jsonResult.reason);
        }

    } catch (error) {
        console.error("Fallo durante la carga de datos:", error);
    }
});


function cargarXML(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                resolve(xhr.responseXML);  // Resolvemos la Promesa y pasamos el XML
            } else {
                reject(`Error al cargar el archivo XML. Estado: ${xhr.status}, Texto de respuesta: ${xhr.statusText}`);
            }
        };

        xhr.onerror = function () {
            reject("Hubo un error de red al intentar cargar el archivo XML.");
        };

        xhr.send();
    });
}

function procesarXML(xml) {
    let params = new URLSearchParams(window.location.search);
    let idArtista = params.get("artista");  // Se sigue usando "artista" como parámetro en la URL
    let artistas = xml.getElementsByTagName("artista");
    for (let i = 0; i < artistas.length; i++) {
        if (artistas[i].getAttribute("id") === idArtista) {  // Compara con el atributo "id"            
            let nombre = artistas[i].getElementsByTagName("nombre")[0].textContent;
            // Aquí actualizamos la meta description dinámicamente
            let metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute("content", `Conoce ${nombre}, artista de CCSTUDIOS. Descubre su trayectoria, próximos eventos y música.`);
            }
             // Actualizamos la meta keywords dinámicamente
             let metaKeywords = document.querySelector('meta[name="keywords"]');
             if (metaKeywords) {
                 let existingKeywords = metaKeywords.getAttribute("content");
                 let newKeywords = existingKeywords ? `${existingKeywords}, ${nombre}` : `${nombre}`;
                 metaKeywords.setAttribute("content", newKeywords);
             }
            // Actualizamos el título de la ficha
            document.getElementById("artistas-title").textContent = nombre;
            let figura = document.getElementById("foto-artista");
            let imagenesFicha = artistas[i].getElementsByTagName("imagenFicha");
            // Cargar todas las imágenes dentro del <figure>
            for (let j = 0; j < imagenesFicha.length; j++) {
                // Crear un nuevo elemento <img> para cada imagen del carrusel
                let img = document.createElement("img");
                img.src = imagenesFicha[j].textContent;
                img.alt = `Imagen ${j + 1}`;
                if (j === 0) img.classList.add("activa");
                figura.appendChild(img);
            }
            document.getElementById("descripcion-trayectoria").textContent = artistas[i].getElementsByTagName("trayectoria")[0].textContent;
            let cancion = artistas[i].getElementsByTagName("cancion")[0];
            document.getElementById("tituloCancion").textContent = cancion.getElementsByTagName("titulo")[0].textContent;
            document.getElementById("tituloCancion").href = cancion.getElementsByTagName("enlace")[0].textContent;
            document.getElementById("portada").src = cancion.getElementsByTagName("imagen")[0].textContent;
            document.getElementById("audio").src = cancion.getElementsByTagName("audio")[0].textContent;

            manejarCarruselDeImagenes();  // Llamar a la función para manejar el carrusel de imágenes
            break;
        }
    }
}

function cargarJSON(url) {
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            throw new Error("Error cargando JSON: " + error);
        });
}

function procesarJSON(eventos) {
    let params = new URLSearchParams(window.location.search);
    let idArtista = params.get("artista"); // Obtiene el parámetro "artista" de la URL
    let listaEventos = document.querySelector("#proximosEventos ul");

    // Filtrar los eventos por el artista
    let eventosFiltrados = eventos.filter(evento =>
        evento.artista.toLowerCase() === idArtista.toLowerCase()
    );

    // Ordenar los eventos por fecha (asegurándote de que la fecha esté en formato YYYY-MM-DD)
    eventosFiltrados.sort((a, b) => new Date(a.dia) - new Date(b.dia));

    // Agregar los eventos ordenados a la lista con el formato solicitado
    eventosFiltrados.forEach(evento => {
        let fecha = new Date(evento.dia);
        let dia = fecha.getDate();
        let mes = fecha.toLocaleString('es-ES', { month: 'short' }).toUpperCase();
        let formatoEvento = `${dia} ${mes} | ${evento.tipo} en ${evento.lugar}`;

        let li = document.createElement("li");
        li.textContent = formatoEvento;
        listaEventos.appendChild(li);
    });
}

function manejarCarruselDeImagenes() {
    let imagenes = document.querySelectorAll("#foto-artista img");
    let botonesFlechas = document.querySelectorAll(".flecha");
    
    if (imagenes.length < 2) {
        // Si hay menos de 2 imágenes, ocultamos los botones
        botonesFlechas.forEach(boton => boton.style.display = "none");
        return;
    }

    // Mostramos los botones si hay más de 1 imagen
    botonesFlechas.forEach(boton => boton.style.display = "block");

    let indiceImagen = 0;

    // Función para cambiar la imagen
    function cambiarImagen(direccion) {
        // Ocultamos la imagen actual
        imagenes[indiceImagen].style.display = "none";

        // Actualizamos el índice
        indiceImagen = (indiceImagen + direccion + imagenes.length) % imagenes.length;

        // Mostramos la nueva imagen
        imagenes[indiceImagen].style.display = "block";
    }

    // Configuración de los botones de flechas
    document.getElementById("anterior").addEventListener("click", () => cambiarImagen(-1));  // Flecha izquierda
    document.getElementById("siguiente").addEventListener("click", () => cambiarImagen(1));  // Flecha derecha
}