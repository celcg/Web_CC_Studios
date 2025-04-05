//Mostrar mensaje de exito al mandar el formulario
document.addEventListener("DOMContentLoaded", function () {
    var formulario = document.getElementById("formularioContacto");

    formulario.addEventListener("submit", function (event) {
        //Evita la recarga de la página
        event.preventDefault();

        //Muestra el mensaje de éxito
        mostrarMensaje();

        //Resetea el formulario después de enviarlo
        formulario.reset();
    });

    function mostrarMensaje() {
        var mensajeExito = document.createElement("div");
        mensajeExito.id = "mensajeExito";
        mensajeExito.className = "alert alert-success text-center mt-3";
        mensajeExito.innerText = "Su mensaje ha sido enviado con éxito.";
        formulario.parentNode.insertBefore(mensajeExito, formulario);

        mensajeExito.classList.remove("hide");
        mensajeExito.classList.add("show");

        //Oculta y elimina el mensaje después de 4 segundos
        setTimeout(function () {
            mensajeExito.classList.remove("show");
            mensajeExito.classList.add("hide");

            //Hay que esperar a que se termine la animación antes de borrar el mensaje
            setTimeout(function () {
                if (mensajeExito) {
                    mensajeExito.remove();
                }
            }, 500);
        }, 4000);
    }
});

window.addEventListener("beforeunload", function () {
    sessionStorage.removeItem("formEnviado");
});
