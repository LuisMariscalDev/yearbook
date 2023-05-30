const anuncios = document.getElementById("anuncios");
const inputBuscar = document.getElementById('buscar');

inputBuscar.addEventListener('keyup', e => {  
    const busqueda = e.target.value.toLowerCase();
    const anuncios = document.querySelectorAll('.anuncio');
    let encontrado = false;

    anuncios.forEach(anuncio => {  
        // Asume que el título del anuncio es lo que quieres comparar con la búsqueda
        const titulo = anuncio.querySelector('h3').textContent.toLowerCase();

        if (titulo.includes(busqueda)) {
            encontrado = true;
            anuncio.style.display = 'block';
        } else {
            anuncio.style.display = 'none';
        }
    });

    if (!encontrado) {
        console.error("No se encontraron anuncios que coincidan con la búsqueda.");
    }
});
function showData (data) {

    data.map((item) => {   

        anuncios.innerHTML += `
                 <div class="anuncio">
            <picture>
                <img loading="lazy" src=" ${item.Foto}" alt="anuncio de casa">
            </picture>

            <div class="contenido-anuncio">
                <h3>${item.Nombre}</h3>
                <p>${item.Frase}</p>
                <p class="precio">${item.Carrera}</p>

                <a href="/anuncio?id=${item.EstudianteID}" class="boton-amarillo-block">
                    Ver Alumno
                </a>
            </div>
        </div>
         `;
    });
}


fetch(`/api/students`)
  .then(response => response.json())
  .then(data => showData(data))
  .catch(error => {
    console.error(error);
  });
  