
//Para gestionar el carrousel
document.addEventListener("DOMContentLoaded", function () {
    const contenedorEquipo = document.querySelector(".team-container");
    const botonMostrarMas = document.getElementById("mostrarMas");
    const botonMostrarMenos = document.getElementById("mostrarMenos");

    //Datos de las neuvas tarjetas
    const miembrosIniciales = [
        {
            nombre: "Mar Arriscado",
            cargo: "Community Manager",
            imagen: "imagenes/index/mar.jpg",
            descripcion: "Mar lidera el equipo de comunicación con una creatividad vibrante y un enfoque estratégico. Es la encargada de conectar a CC Studios con el público a través de campañas innovadoras y redes sociales, manteniendo la identidad de la marca y generando impacto en cada lanzamiento.",
            email: "marCM@ccstudios.com"
        },
        {
            nombre: "Celtia Castelo",
            cargo: "CEO y Cofundadora",
            imagen: "imagenes/index/celtia.jpg",
            descripcion: "Visionaria y apasionada de la producción musical, su objetivo es transformar el panorama musical en España. Su liderazgo ha sido clave para consolidar la identidad de la discográfica y expandir su proyección internacional. Actualmente, dirige la estrategia global del estudio, explorando nuevos mercados.",
            email: "ccastelo@ccstudios.com"
        },
        {
            nombre: "Carolina Alba",
            cargo: "CEO y Cofundadora",
            imagen: "imagenes/index/carolina.jpg",
            descripcion: "Sin duda, el alma creativa detrás de todos los grandes éxitos del estudio. Su enfoque artístico y compromiso con la excelencia han sido pilares fundamentales desde nuestros inicios. Hoy, lidera los proyectos de innovación y desarrollo artístico encarrilando nuestra compañia hacia la excelencia.", 
            email: "calba@ccstudios.com"
        },
    ];

    //Copia del array original
    let nuevosMiembros = [...miembrosIniciales];
    let miembrosMostrados = [];

    //Función para añadir un miembro al carrusel
    botonMostrarMas.addEventListener("click", function () {
        if (nuevosMiembros.length > 0) {
            const miembro = nuevosMiembros.shift(); // Extrae el primer miembro

            //Creamos la nueva tarjeta de equipo
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

            //Mostramos el botón "Mostrar Menos" si hay miembros visibles
            if (miembrosMostrados.length > 0) {
                botonMostrarMenos.style.display = "inline-block";
            }

            //Ocultamos "Mostrar Más" si ya no hay más miembros por agregar
            if (nuevosMiembros.length === 0) {
                botonMostrarMas.style.display = "none";
            }
        }
    });

    //Función para eliminar un miembro del carrusel
    botonMostrarMenos.addEventListener("click", function () {
        if (miembrosMostrados.length > 0) {
            //Quitamos el último miembro agregado
            const miembroAEliminar = miembrosMostrados.pop();
            contenedorEquipo.removeChild(miembroAEliminar.elemento);

            //Volvemos a añadirlo a la lista de miembros disponibles en la primera posición
            nuevosMiembros.unshift(miembroAEliminar.datos);

            //Mostramos el botón "Mostrar Más" ya que hay miembros ocultos disponibles
            if (nuevosMiembros.length > 0) {
                botonMostrarMas.style.display = "inline-block";
            }

            //Ocultamos "Mostrar Menos" si ya no hay más miembros visibles
            if (miembrosMostrados.length === 0) {
                botonMostrarMenos.style.display = "none";
            }
        }
    });

    //Ocultamos "Mostrar Menos" al principio, ya que no hay miembros extra al cargar la página
    botonMostrarMenos.style.display = "none";
});

//Para animar el contador de estadisticas
document.addEventListener("DOMContentLoaded", () => {
    const counters = document.querySelectorAll(".counter");
    const speed = 200; // Velocidad de la animación

    //Función para animar los contadores
    const animateCounter = (counter) => {
        const target = +counter.getAttribute("data-target");
        const increment = target / speed;
        let count = 0;

        const updateCounter = () => {
            count += increment;
            if (count < target) {
                counter.innerText = Math.floor(count);
                requestAnimationFrame(updateCounter);
            } else {
                counter.innerText = target;
            }
        };

        updateCounter();
    };

    //Observer para iniciar cuando el usuario llega a los contadores
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                //Solo una vez
                observer.unobserve(counter);
            }
        });
    }, {
        //Se activa cuando el 50% del elemento es visible
        threshold: 0.5
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });

    //Función para reiniciar contador
    const restartCounter = (event) => {
        const counter = event.currentTarget.querySelector(".counter");
        counter.innerText = "0"; // Resetea a 0
        animateCounter(counter);
    };

    //Añadimos evento "mouseenter" para reiniciar cada vez que pase el cursor
    document.querySelectorAll(".stat-card").forEach(card => {
        card.addEventListener("mouseenter", restartCounter);
    });
});


//Para añadir el efecto escritura a la parte de vision y valores
document.addEventListener("DOMContentLoaded", () => {
    const target = document.querySelector('.typing');
    if (target) {
        const text = target.dataset.text;
        let index = 0;
        //Nos aseguramos de que empiece vacío
        target.textContent = '';

        const typeWriter = () => {
            if (index < text.length) {
                target.textContent += text.charAt(index);
                index++;
                //Velocidad del contador
                setTimeout(typeWriter, 60);
            }
        };

        //Para que comience cuando el usuario llegue a es parte de la página
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    //Solo lo escribe una vez
                    observer.unobserve(entry.target);
                }
            });
        }, {
            //Se activa cuando el 70% del h4 es visible
            threshold: 0.7
        });

        observer.observe(target);
    }
});




