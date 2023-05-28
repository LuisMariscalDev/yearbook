document.addEventListener('DOMContentLoaded', function(){

    evenListeners();

    // Obtener el valor de la cookie "modoOscuro"
    const modoOscuro = getCookie('modoOscuro');

    // Si la cookie "modoOscuro" existe y su valor es "true", activar el modo oscuro
    if (modoOscuro === 'true') {
        document.body.classList.add('darkMode');
    }

    darkMode();
});

function darkMode(){
    const botonDarkMode = document.querySelector('.dark-mode-boton');

    botonDarkMode.addEventListener('click', function(){
        document.body.classList.toggle('darkMode')

        // Crear o actualizar la cookie "modoOscuro"
        if (document.body.classList.contains('darkMode')) {
            setCookie('modoOscuro', 'true', 30);
        } else {
            setCookie('modoOscuro', 'false', 30);
        }
    });
}

function evenListeners(){
    const mobileMenu = document.querySelector('.mobile-menu');

    mobileMenu.addEventListener('click', navegacionResposive);
}

function navegacionResposive() {
    const navegacion = document.querySelector('.navegacion');

    if(navegacion.classList.contains('mostrar')){
        navegacion.classList.remove('mostrar');
    } else {
        navegacion.classList.add('mostrar');
    }
}

// Función para obtener el valor de una cookie por su nombre
function getCookie(nombre) {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        // Si la cookie actual comienza con el nombre buscado, devolver su valor
        if (cookie.startsWith(`${nombre}=`)) {
            return cookie.substring(nombre.length + 1);
        }
    }

    // Si no se encontró la cookie, devolver un valor nulo
    return null;
}

// Función para crear o actualizar una cookie
function setCookie(nombre, valor, diasExpiracion) {
    const fechaExpiracion = new Date();
    fechaExpiracion.setTime(fechaExpiracion.getTime() + (diasExpiracion * 24 * 60 * 60 * 1000));

    const cookie = `${nombre}=${valor}; expires=${fechaExpiracion.toUTCString()}; path=/`;

    document.cookie = cookie;
}
