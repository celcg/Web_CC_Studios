document.addEventListener("DOMContentLoaded", function () {
    cargarXML("js/data/fichas.xml");
    cargarJSON("js/data/eventos.json");
});

function cargarXML(url) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            procesarXML(xhr.responseXML);
        }
    };
    xhr.send();
}

function procesarXML(xml) {
    let params = new URLSearchParams(window.location.search);
    let idArtista = params.get("artista");  // Se sigue usando "artista" como parámetro en la URL
    console.log("ID Artista desde la URL:", idArtista);  // Verificar el idArtista que llega desde la URL

    let artistas = xml.getElementsByTagName("artista");
    console.log("Artistas encontrados en el XML:", artistas);  // Verificar los artistas en el XML
    
    for (let i = 0; i < artistas.length; i++) {
        console.log("Comparando con artista ID:", artistas[i].getAttribute("id"));  // Mostrar el id del artista actual
        
        if (artistas[i].getAttribute("id") === idArtista) {  // Compara con el atributo "id"
            console.log("Artista encontrado:", artistas[i].getElementsByTagName("nombre")[0].textContent);  // Verificar nombre del artista encontrado
            
            let nombre = artistas[i].getElementsByTagName("nombre")[0].textContent;
            document.getElementById("artistas-title").textContent = nombre;
            document.getElementById("foto-artista").querySelector("img").src = artistas[i].getElementsByTagName("imagenFicha")[0].textContent;
            document.getElementById("descripcion-trayectoria").textContent = artistas[i].getElementsByTagName("trayectoria")[0].textContent;
            
            let cancion = artistas[i].getElementsByTagName("cancion")[0];
            console.log("Canción encontrada:", cancion);  // Verificar los detalles de la canción
            
            document.getElementById("tituloCancion").textContent = cancion.getElementsByTagName("titulo")[0].textContent;
            document.getElementById("tituloCancion").href = cancion.getElementsByTagName("enlace")[0].textContent;
            document.getElementById("portada").src = cancion.getElementsByTagName("imagen")[0].textContent;
            document.getElementById("audio").src = cancion.getElementsByTagName("audio")[0].textContent;
            break;
        }
    }
}


function cargarJSON(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => procesarJSON(data))
        .catch(error => console.error("Error cargando JSON:", error));
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


