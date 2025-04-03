document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formularioContacto");

    formulario.addEventListener("submit", function (event) {
         // Evita la recarga de la página
        event.preventDefault();

        // Mostrar el mensaje de éxito
        mostrarMensaje();

        // Resetear el formulario después de enviarlo
        formulario.reset();
    });

    function mostrarMensaje() {
        
        mensajeExito = document.createElement("div");
        mensajeExito.id = "mensajeExito";
        mensajeExito.className = "alert alert-success text-center mt-3";
        mensajeExito.innerText = "Su mensaje ha sido enviado con éxito.";
        formulario.parentNode.insertBefore(mensajeExito, formulario);

        // Agregar clases para mostrar el mensaje con animación
        mensajeExito.classList.remove("hide");
        mensajeExito.classList.add("show");

        // Ocultar y eliminar el mensaje después de 4 segundos
        setTimeout(() => {
            mensajeExito.classList.remove("show");
            mensajeExito.classList.add("hide");

            // Esperar a que termine la animación antes de eliminarlo
            setTimeout(() => {
                if (mensajeExito) {
                    mensajeExito.remove(); // Eliminar completamente del DOM
                }
            }, 500); // Tiempo suficiente para que termine la animación
        }, 4000);
    }
});


window.addEventListener("beforeunload", function () {
    sessionStorage.removeItem("formEnviado");
});
