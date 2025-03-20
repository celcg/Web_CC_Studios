document.addEventListener("DOMContentLoaded", () => {
    const monthNameElement = document.getElementById("monthName");
    const daysContainer = document.querySelector(".days");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const eventosContainer = document.querySelector(".eventos-lista");
    const selectEventos = document.getElementById("selectEventos");

    let today = new Date();
    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const coloresArtistas = {
        "Judeline": "#ff6347", // Tomate
        "Sen Senra": "#4682b4", // Azul acero
        "Aitana": "#32cd32", // Verde lima
        "Bad Bunny": "#8a2be2", // Azul violeta
        "Natalia Lacunza": "#006400", //Verde oscuro
        "Pitbull": "#00bfff", // Azul profundo
        "C. Tangana": "#8b0000", // Rojo oscuro
        "Tini": "#ff69b4" // Rosa brillante
    };

    let eventosPorMes = new Map();

    function cargarEventosDesdeJSON(month, year, tipoFiltro = "") {
        return fetch("../js/data/eventos.json")
            .then(response => response.json())
            .then(eventos => {
                // Filtrar eventos para el mes y año actuales, y aplicar el filtro de tipo
                const eventosFiltrados = eventos.filter(evento => {
                    const fecha = new Date(evento.dia);
                    const tipoCoincide = tipoFiltro ? evento.tipo.toLowerCase() === tipoFiltro.toLowerCase() : true;
                    return fecha.getMonth() === month && fecha.getFullYear() === year && tipoCoincide;
                });

                // Limpiar eventos previos
                eventosContainer.innerHTML = "";

                // Si no hay eventos, mostramos un mensaje
                if (eventosFiltrados.length === 0) {
                    const noEventCard = document.createElement("article");
                    noEventCard.classList.add("evento-card", "sin-eventos");
                    noEventCard.innerHTML = ` 
                        <h3>📅 Sin eventos este mes</h3>
                        <p>Vuelve más tarde para ver nuevas fechas.</p>
                    `;
                    eventosContainer.appendChild(noEventCard);
                }

                // Asignar eventos a días
                const eventosPorDia = new Map();
                eventosFiltrados.forEach(evento => {
                    const diaEvento = new Date(evento.dia).getDate();
                    const colorArtista = coloresArtistas[evento.artista] || "#cccccc"; // Gris por defecto si no hay color asignado

                    if (!eventosPorDia.has(diaEvento)) {
                        eventosPorDia.set(diaEvento, []);
                    }
                    eventosPorDia.get(diaEvento).push(colorArtista);
                });

                // Ahora que tenemos los eventos, generamos el calendario
                generateCalendar(month, year, eventosPorDia);

                // Mostrar los eventos en la lista
                eventosFiltrados.forEach(evento => {
                    const eventCard = document.createElement("article");
                    eventCard.classList.add("evento-card");

                    const colorArtista = coloresArtistas[evento.artista] || "#cccccc"; // Gris por defecto si no hay color asignado
                    eventCard.style.borderColor = colorArtista;

                    eventCard.innerHTML = ` 
                        <h3>${new Date(evento.dia).getDate()} ${monthNames[month].substring(0, 3).toUpperCase()} | ${evento.tipo} <strong>${evento.artista}</strong></h3>
                        <p>${evento.lugar}</p>
                    `;
                    eventosContainer.appendChild(eventCard);
                });

                return eventosPorDia;
            })
            .catch(error => console.error("Error al cargar eventos:", error));
    }

    function generateCalendar(month, year, eventosPorDia) {
        daysContainer.innerHTML = "";
        monthNameElement.textContent = `${monthNames[month]} ${year}`;

        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();
        const dayOffset = firstDay === 0 ? 6 : firstDay - 1;

        for (let i = 0; i < dayOffset; i++) {
            const emptyLi = document.createElement("li");
            daysContainer.appendChild(emptyLi);
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayLi = document.createElement("li");
            dayLi.textContent = day;

            // Si el día tiene eventos, asignamos los colores correspondientes
            if (eventosPorDia.has(day)) {
                const colores = eventosPorDia.get(day);
                dayLi.classList.add("evento");

                if (colores.length > 1) {
                     // Crear un degradado para el borde con box-shadow
             dayLi.style.boxShadow = `0 0 0 2px ${colores[0]}, 0 0 0 4px ${colores.slice(1).join(", ")}`;
                } else {
                    dayLi.style.borderColor = colores[0];
                }
            }

            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayLi.classList.add("hoy");
            }

            daysContainer.appendChild(dayLi);
        }
    }

    prevMonthBtn.addEventListener("click", () => {
        if (currentMonth === 0) {
            currentMonth = 11;
            currentYear--;
        } else {
            currentMonth--;
        }
        cargarEventosDesdeJSON(currentMonth, currentYear, selectEventos.value);
    });

    nextMonthBtn.addEventListener("click", () => {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        cargarEventosDesdeJSON(currentMonth, currentYear, selectEventos.value);
    });

    selectEventos.addEventListener("change", () => {
        cargarEventosDesdeJSON(currentMonth, currentYear, selectEventos.value);
    });

    // Cargar eventos y generar el calendario inicialmente
    cargarEventosDesdeJSON(currentMonth, currentYear);
});
