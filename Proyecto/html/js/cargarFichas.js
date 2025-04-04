document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Cargar XML y JSON de manera paralela
        const results = await Promise.allSettled([
            cargarXML("js/data/fichas.xml"),
            cargarJSON("jss/data/eventos.json")
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
            document.getElementById("artistas-title").textContent = nombre;
            document.getElementById("foto-artista").querySelector("img").src = artistas[i].getElementsByTagName("imagenFicha")[0].textContent;
            document.getElementById("descripcion-trayectoria").textContent = artistas[i].getElementsByTagName("trayectoria")[0].textContent;
            
            let cancion = artistas[i].getElementsByTagName("cancion")[0];
            
            document.getElementById("tituloCancion").textContent = cancion.getElementsByTagName("titulo")[0].textContent;
            document.getElementById("tituloCancion").href = cancion.getElementsByTagName("enlace")[0].textContent;
            document.getElementById("portada").src = cancion.getElementsByTagName("imagen")[0].textContent;
            document.getElementById("audio").src = cancion.getElementsByTagName("audio")[0].textContent;
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
