document.getElementById("menuToggle").addEventListener("click", function(event) {
    event.preventDefault(); // Evita que recargue la página
    const nav = document.getElementById("NavPrincipal");

    // Si el menú está visible, lo ocultamos, y si está oculto, lo mostramos
  
        if (nav.style.display === "none") {
            nav.style.display = "inline-block";
        } else {
            nav.style.display = "none";
       }
    
});

// Asegúrate de que el menú esté siempre visible en pantallas grandes
window.addEventListener("resize", function() {
    const nav = document.getElementById("NavPrincipal");
    if (window.innerWidth > 769) {
        nav.style.display = "flex";  // El menú debe estar siempre visible en pantallas grandes
    } else {
        nav.style.display = "none";   // El menú se oculta en pantallas pequeñas por defecto
    }
});
