const anuncios = document.getElementById("anuncios");

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
  