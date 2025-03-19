document.addEventListener("DOMContentLoaded", () => {
    const monthNameElement = document.getElementById("monthName");
    const daysContainer = document.querySelector(".days");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");

    let today = new Date(); // Obtiene la fecha actual
    let currentMonth = today.getMonth(); // Mes actual (0-11)
    let currentYear = today.getFullYear(); // Año actual

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    function generateCalendar(month, year) {
        daysContainer.innerHTML = ""; // Limpia el contenido anterior
        monthNameElement.textContent = `${monthNames[month]} ${year}`; // Actualiza el título

        const firstDay = new Date(year, month, 1).getDay(); // Día de la semana del primer día
        const lastDate = new Date(year, month + 1, 0).getDate(); // Último día del mes
        const dayOffset = firstDay === 0 ? 6 : firstDay - 1; // Ajuste para que el lunes sea el primer día

        // Espacios vacíos antes del primer día del mes
        for (let i = 0; i < dayOffset; i++) {
            const emptyLi = document.createElement("li");
            daysContainer.appendChild(emptyLi);
        }

        // Días del mes
        for (let day = 1; day <= lastDate; day++) {
            const dayLi = document.createElement("li");
            dayLi.textContent = day;

            // Agregar clase especial si es el día actual
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
        generateCalendar(currentMonth, currentYear);
    });

    nextMonthBtn.addEventListener("click", () => {
        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    generateCalendar(currentMonth, currentYear); // Carga el mes actual al inicio
});
