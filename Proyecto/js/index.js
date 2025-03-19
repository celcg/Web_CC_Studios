document.addEventListener("DOMContentLoaded", function () {
    const contenedorEquipo = document.querySelector(".team-container");
    const botonMostrarMas = document.getElementById("mostrarMas");
    const botonMostrarMenos = document.getElementById("mostrarMenos");

    // Datos de los miembros adicionales (siempre en el mismo orden)
    const miembrosIniciales = [
        {
            nombre: "María Acebo",
            cargo: "A&R",
            imagen: "imagenes/index/maria.jpg",
            descripcion: "Apasionada por descubrir nuevos talentos...",
            email: "mariaacebo@ccstudios.com"
        },
        {
            nombre: "Julio Vega",
            cargo: "Director Creativo",
            imagen: "imagenes/index/julio.jpg",
            descripcion: "Apasionado por la innovación visual...",
            email: "juliov@ccstudios.com"
        }
    ];

    let nuevosMiembros = [...miembrosIniciales]; // Clon del array original
    let miembrosMostrados = [];

    // Función para añadir un miembro al carrusel
    botonMostrarMas.addEventListener("click", function () {
        if (nuevosMiembros.length > 0) {
            const miembro = nuevosMiembros.shift(); // Extrae el primer miembro

            // Crear tarjeta de equipo
            const tarjeta = document.createElement("article");
            tarjeta.classList.add("team-card");

            tarjeta.innerHTML = `
                <h3>${miembro.nombre}</h3>
                <h4>${miembro.cargo}</h4>
                <img src="${miembro.imagen}" alt="${miembro.nombre}">
                <p>${miembro.descripcion}</p>
                <p>Email: <a href="mailto:${miembro.email}">${miembro.email}</a></p>
            `;

            contenedorEquipo.appendChild(tarjeta);
            miembrosMostrados.push({ elemento: tarjeta, datos: miembro });

            // Mostrar el botón "Mostrar Menos" si hay miembros visibles
            if (miembrosMostrados.length > 0) {
                botonMostrarMenos.style.display = "inline-block";
            }

            // Ocultar "Mostrar Más" si ya no hay más miembros por agregar
            if (nuevosMiembros.length === 0) {
                botonMostrarMas.style.display = "none";
            }
        }
    });

    // Función para eliminar un miembro del carrusel
    botonMostrarMenos.addEventListener("click", function () {
        if (miembrosMostrados.length > 0) {
            const miembroAEliminar = miembrosMostrados.pop(); // Saca el último miembro agregado
            contenedorEquipo.removeChild(miembroAEliminar.elemento);

            // Volver a agregarlo a la lista de miembros disponibles en la primera posición
            nuevosMiembros.unshift(miembroAEliminar.datos);

            // Mostrar el botón "Mostrar Más" ya que hay miembros ocultos disponibles
            if (nuevosMiembros.length > 0) {
                botonMostrarMas.style.display = "inline-block";
            }

            // Ocultar "Mostrar Menos" si ya no hay más miembros visibles
            if (miembrosMostrados.length === 0) {
                botonMostrarMenos.style.display = "none";
            }
        }
    });

    // Ocultar "Mostrar Menos" al inicio, ya que no hay miembros extra al cargar la página
    botonMostrarMenos.style.display = "none";
});
