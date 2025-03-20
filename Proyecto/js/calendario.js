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
        "Natalia Lacunza": "#006400", // Verde oscuro
        "Pitbull": "#00bfff", // Azul profundo
        "C. Tangana": "#8b0000", // Rojo oscuro
        "Tini": "#ff69b4" // Rosa brillante
    };

    function cargarEventosDesdeJSON(month, year, tipoFiltro = "") {
        return fetch("../js/data/eventos.json")
            .then(response => response.json())
            .then(eventos => {
                const eventosFiltrados = eventos.filter(evento => {
                    const fecha = new Date(evento.dia);
                    const tipoCoincide = tipoFiltro ? evento.tipo.toLowerCase() === tipoFiltro.toLowerCase() : true;
                    return fecha.getMonth() === month && fecha.getFullYear() === year && tipoCoincide;
                });

                eventosContainer.innerHTML = "";

                if (eventosFiltrados.length === 0) {
                    const noEventCard = document.createElement("article");
                    noEventCard.classList.add("evento-card", "sin-eventos");
                    noEventCard.innerHTML = ` 
                        <h3>📅 Sin eventos este mes</h3>
                        <p>Vuelve más tarde para ver nuevas fechas.</p>
                    `;
                    eventosContainer.appendChild(noEventCard);
                }

                const eventosPorDia = new Map();
                eventosFiltrados.forEach(evento => {
                    const diaEvento = new Date(evento.dia).getDate();
                    const colorArtista = coloresArtistas[evento.artista] || "#cccccc";

                    if (!eventosPorDia.has(diaEvento)) {
                        eventosPorDia.set(diaEvento, []);
                    }
                    eventosPorDia.get(diaEvento).push(colorArtista);
                });

                generateCalendar(month, year, eventosPorDia);

                eventosFiltrados.forEach(evento => {
                    const eventCard = document.createElement("article");
                    eventCard.classList.add("evento-card");
                    eventCard.style.borderColor = coloresArtistas[evento.artista] || "#cccccc";
                    eventCard.innerHTML = ` 
                        <h3>${new Date(evento.dia).getDate()} ${monthNames[month].substring(0, 3).toUpperCase()} | ${evento.tipo} <strong>${evento.artista}</strong></h3>
                        <p>${evento.lugar}</p>
                    `;
                    eventosContainer.appendChild(eventCard);
                });

                agregarEventosHover();
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
            daysContainer.appendChild(document.createElement("li"));
        }

        for (let day = 1; day <= lastDate; day++) {
            const dayLi = document.createElement("li");
            dayLi.textContent = day;

            if (eventosPorDia.has(day)) {
                const colores = eventosPorDia.get(day);
                dayLi.classList.add("evento");
                dayLi.style.borderColor = colores.length > 1 ? "transparent" : colores[0];
                if (colores.length > 1) {
                    dayLi.style.boxShadow = `0 0 0 2px ${colores[0]}, 0 0 0 4px ${colores.slice(1).join(", ")}`;
                }
            }

            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayLi.classList.add("hoy");
            }

            daysContainer.appendChild(dayLi);
        }
    }

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

    selectEventos.addEventListener("change", () => {
        cargarEventosDesdeJSON(currentMonth, currentYear, selectEventos.value);
    });

    cargarEventosDesdeJSON(currentMonth, currentYear);
});