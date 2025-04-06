// Espera a que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", () => {
    // Elementos del DOM que se utilizarán
    const monthNameElement = document.getElementById("monthName"); // Elemento que muestra el nombre del mes
    const daysContainer = document.querySelector(".days"); // Contenedor de los días del calendario
    const prevMonthBtn = document.getElementById("prevMonth"); // Botón para ir al mes anterior
    const nextMonthBtn = document.getElementById("nextMonth"); // Botón para ir al mes siguiente
    const eventosContainer = document.querySelector(".eventos-lista"); // Contenedor de las tarjetas de eventos
    const selectEventos = document.getElementById("selectEventos"); // Selector para filtrar eventos por tipo

    // Fecha actual
    let today = new Date();
    let currentMonth = today.getMonth(); // Mes actual
    let currentYear = today.getFullYear(); // Año actual

    // Nombres de los meses
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Colores asociados a cada artista
    const coloresArtistas = {
        "Judeline": "#ff6347", // Tomate
        "Sen Senra": "#4682b4", // Azul acero
        "Aitana": "#32cd32", // Verde lima
        "Bad Bunny": "#8a2be2", // Azul violeta
        "Natalia Lacunza": "#006400", // Verde oscuro
        "Pitbull": "#00bfff", // Azul profundo
        "C.Tangana": "#8b0000", // Rojo oscuro
        "Tini": "#ff69b4" // Rosa brillante
    };

    // Carga los eventos desde un archivo JSON y los filtra por mes, año y tipo
    function cargarEventosDesdeJSON(month, year, tipoFiltro = "") {
        return fetch("js/data/eventos.json") // Carga el archivo JSON
            .then(response => response.json()) // Convierte la respuesta a JSON
            .then(eventos => {
                // Filtra los eventos por mes, año y tipo
                const eventosFiltrados = eventos.filter(evento => {
                    const fecha = new Date(evento.dia); // Convierte la fecha del evento a un objeto Date
                    const tipoCoincide = tipoFiltro ? evento.tipo.toLowerCase() === tipoFiltro.toLowerCase() : true;
                    return fecha.getMonth() === month && fecha.getFullYear() === year && tipoCoincide;
                });

                // Limpia el contenedor de eventos
                eventosContainer.innerHTML = "";

                // Si no hay eventos, muestra un mensaje
                if (eventosFiltrados.length === 0) {
                    const noEventCard = document.createElement("article");
                    noEventCard.classList.add("evento-card", "sin-eventos");
                    noEventCard.innerHTML = ` 
                        <h3>📅 Sin eventos este mes</h3>
                        <p>Vuelve más tarde para ver nuevas fechas.</p>
                    `;
                    eventosContainer.appendChild(noEventCard);
                }

                // Agrupa los eventos por día
                const eventosPorDia = new Map();
                eventosFiltrados.forEach(evento => {
                    const diaEvento = new Date(evento.dia).getDate(); // Obtiene el día del evento
                    const colorArtista = coloresArtistas[evento.artista] || "#cccccc"; // Color asociado al artista

                    if (!eventosPorDia.has(diaEvento)) {
                        eventosPorDia.set(diaEvento, []);
                    }
                    eventosPorDia.get(diaEvento).push(colorArtista); // Añade el color al día correspondiente
                    const eventCard = document.createElement("article");
                    eventCard.classList.add("evento-card");
                    eventCard.style.borderColor = coloresArtistas[evento.artista] || "#cccccc";
                    eventCard.innerHTML = ` 
                        <h3>${new Date(evento.dia).getDate()} ${monthNames[month].substring(0, 3).toUpperCase()} | ${evento.tipo} <strong>${evento.artista}</strong></h3>
                        <p>${evento.lugar}</p>
                    `;
                    eventosContainer.appendChild(eventCard);
                });

                // Genera el calendario con los eventos
                generateCalendar(month, year, eventosPorDia);
                agregarEventosHover();
            })
            .catch(error => {
                console.error("Error al cargar eventos:", error);
            
                // Limpiar contenedor de eventos
                eventosContainer.innerHTML = "";
            
                // Mostrar mensaje de error al usuario
                const errorCard = document.createElement("article");
                errorCard.classList.add("evento-card", "sin-eventos");
                errorCard.innerHTML = `
                    <h3>⚠️ Error al cargar los eventos</h3>
                    <p>No se han podido recuperar los datos. Inténtalo más tarde.</p>
                `;
                eventosContainer.appendChild(errorCard);
            
                // Llamar a generateCalendar con eventos NULL (vacío o nulo)
                generateCalendar(month, year, new Map()); // Pasar un mapa vacío para el calendario sin eventos
            });
    }

    function generateCalendar(month, year, eventosPorDia) {
        daysContainer.innerHTML = "";
        monthNameElement.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const dayOffset = firstDay === 0 ? 6 : firstDay - 1; //cuantos espacios vacíos hay que poner al principio del calendario, antes del día 1 

        for (let i = 0; i < dayOffset; i++) {
            daysContainer.appendChild(document.createElement("li"));
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayLi = document.createElement("li");
            dayLi.textContent = day;

            if (eventosPorDia.has(day)) { //comprueba si hay eventos para ese día
                const colores = eventosPorDia.get(day);
                dayLi.classList.add("evento");
                //pone el color del borde del día dependiendo del artista que tenga el evento
                dayLi.style.borderColor = colores.length > 1 ? "transparent" : colores[0];
                if (colores.length > 1) { //por si hay más de un evento en el mismo día
                    dayLi.style.boxShadow = `0 0 0 2px ${colores[0]}, 0 0 0 4px ${colores.slice(1).join(", ")}`;
                }
            }
            // Añadir clase "hoy" si es el día actual
            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayLi.classList.add("hoy");
            }

            daysContainer.appendChild(dayLi);
        }
    }
    // Resalta los eventos al pasar el ratón por encima de los días en el calendario
    function agregarEventosHover() {
        document.querySelectorAll(".days li.evento").forEach(dia => {
            dia.addEventListener("mouseover", () => {
                const diaNumero = dia.textContent.trim();
                document.querySelectorAll(".evento-card").forEach(evento => {
                    if (evento.innerHTML.includes(`>${diaNumero} `)) {
                        evento.classList.add("resaltado");
                    }
                });
            });
            dia.addEventListener("mouseout", () => {
                document.querySelectorAll(".evento-card").forEach(evento => {
                    evento.classList.remove("resaltado");
                });
            });
        });
    }
    //Cambiar de mes al hacer clic en los botones
    prevMonthBtn.addEventListener("click", () => {
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
        cargarEventosDesdeJSON(currentMonth, currentYear, selectEventos.value);
    });

    nextMonthBtn.addEventListener("click", () => {
        currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
        cargarEventosDesdeJSON(currentMonth, currentYear, selectEventos.value);
    });
    // Cambiar los eventos mostrados al seleccionar un tipo en el selector
    selectEventos.addEventListener("change", () => {
        cargarEventosDesdeJSON(currentMonth, currentYear, selectEventos.value);
    });

    cargarEventosDesdeJSON(currentMonth, currentYear);
});