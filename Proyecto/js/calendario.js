document.addEventListener("DOMContentLoaded", function() {
    var monthNameElement = document.getElementById("monthName");
    var daysContainer = document.querySelector(".days");
    var prevMonthBtn = document.getElementById("prevMonth");
    var nextMonthBtn = document.getElementById("nextMonth");
    var eventosContainer = document.querySelector(".eventos-lista");
    var selectEventos = document.getElementById("selectEventos");

    var today = new Date();
    var currentMonth = today.getMonth();
    var currentYear = today.getFullYear();

    var monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    var coloresArtistas = {
        "Judeline": "#ff6347", // Tomate
        "Sen Senra": "#4682b4", // Azul acero
        "Aitana": "#32cd32", // Verde lima
        "Bad Bunny": "#8a2be2", // Azul violeta
        "Natalia Lacunza": "#006400", // Verde oscuro
        "Pitbull": "#00bfff", // Azul profundo
        "C. Tangana": "#8b0000", // Rojo oscuro
        "Tini": "#ff69b4" // Rosa brillante
    };

    function cargarEventosDesdeJSON(month, year, tipoFiltro) {
        if (tipoFiltro === undefined) tipoFiltro = "";

        return fetch("../js/data/eventos.json")
            .then(function(response) {
                return response.json();
            })
            .then(function(eventos) {
                var eventosFiltrados = eventos.filter(function(evento) {
                    var fecha = new Date(evento.dia);
                    var tipoCoincide = tipoFiltro ? evento.tipo.toLowerCase() === tipoFiltro.toLowerCase() : true;
                    return fecha.getMonth() === month && fecha.getFullYear() === year && tipoCoincide;
                });

                eventosContainer.innerHTML = "";

                if (eventosFiltrados.length === 0) {
                    var noEventCard = document.createElement("article");
                    noEventCard.classList.add("evento-card", "sin-eventos");
                    noEventCard.innerHTML = ` 
                        <h3>📅 Sin eventos este mes</h3>
                        <p>Vuelve más tarde para ver nuevas fechas.</p>
                    `;
                    eventosContainer.appendChild(noEventCard);
                }

                var eventosPorDia = new Map();
                eventosFiltrados.forEach(function(evento) {
                    var diaEvento = new Date(evento.dia).getDate();
                    var colorArtista = coloresArtistas[evento.artista] || "#cccccc";

                    if (!eventosPorDia.has(diaEvento)) {
                        eventosPorDia.set(diaEvento, []);
                    }
                    eventosPorDia.get(diaEvento).push(colorArtista);
                });

                generateCalendar(month, year, eventosPorDia);

                eventosFiltrados.forEach(function(evento) {
                    var eventCard = document.createElement("article");
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
            .catch(function(error) {
                console.error("Error al cargar eventos:", error);
            });
    }

    function generateCalendar(month, year, eventosPorDia) {
        daysContainer.innerHTML = "";
        monthNameElement.textContent = monthNames[month] + " " + year;

        var firstDay = new Date(year, month, 1).getDay();
        var lastDate = new Date(year, month + 1, 0).getDate();
        var dayOffset = firstDay === 0 ? 6 : firstDay - 1;

        for (var i = 0; i < dayOffset; i++) {
            daysContainer.appendChild(document.createElement("li"));
        }

        for (var day = 1; day <= lastDate; day++) {
            var dayLi = document.createElement("li");
            dayLi.textContent = day;

            if (eventosPorDia.has(day)) {
                var colores = eventosPorDia.get(day);
                dayLi.classList.add("evento");
                dayLi.style.borderColor = colores.length > 1 ? "transparent" : colores[0];
                if (colores.length > 1) {
                    dayLi.style.boxShadow = "0 0 0 2px " + colores[0] + ", 0 0 0 4px " + colores.slice(1).join(", ");
                }
            }

            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayLi.classList.add("hoy");
            }

            daysContainer.appendChild(dayLi);
        }
    }

    function agregarEventosHover() {
        document.querySelectorAll(".days li.evento").forEach(function(dia) {
            dia.addEventListener("mouseover", function() {
                var diaNumero = dia.textContent.trim();
                document.querySelectorAll(".evento-card").forEach(function(evento) {
                    if (evento.innerHTML.includes(">" + diaNumero + " ")) {
                        evento.classList.add("resaltado");
                    }
                });
            });
            dia.addEventListener("mouseout", function() {
                document.querySelectorAll(".evento-card").forEach(function(evento) {
                    evento.classList.remove("resaltado");
                });
            });
        });
    }

    prevMonthBtn.addEventListener("click", function() {
        currentMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        currentYear = currentMonth === 11 ? currentYear - 1 : currentYear;
        cargarEventosDesdeJSON(currentMonth, currentYear, selectEventos.value);
    });

    nextMonthBtn.addEventListener("click", function() {
        currentMonth = currentMonth === 11 ? 0 : currentMonth + 1;
        currentYear = currentMonth === 0 ? currentYear + 1 : currentYear;
        cargarEventosDesdeJSON(currentMonth, currentYear, selectEventos.value);
    });

    selectEventos.addEventListener("change", function() {
        cargarEventosDesdeJSON(currentMonth, currentYear, selectEventos.value);
    });

    cargarEventosDesdeJSON(currentMonth, currentYear);
});
