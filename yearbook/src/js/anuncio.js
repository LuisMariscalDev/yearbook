const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");
const anuncio = document.getElementById("anuncios");


function showData (data) {
  console.log(data)
    anuncio.innerHTML = `
    <h1>${data[0].Nombre}</h1>

    <picture class="alumno-descripcion">
        <img loading="lazy" src="${data[0].Foto}" alt="imagen de la propiedad">
    </picture>

    <div class="resumen-propiedad">
        <p class="precio">${data[0].Carrera}</p>


        <h2>Intereses Académicos</h2>
        <p id="StudentIntereses">${data[0].Intereses}</p>

        <h2>Habilidades y Fortalezas</h2>
        <p id="StudentHabilidades">${data[0].Habilidades}</p>

        <h2 id="StudenGoals">Metas a Corto y Largo Plazo</h2>
        <p>${data[0].Objetivos}</p>

        <h2>Nombre del Proyecto:</h2>
        <h2 id="projectName">${data[0].NombreProyecto}</h2>
        <picture class="alumno-descripcion">
            <img loading="lazy" src="${data[0].Fotopro}" alt="imagen de la propiedad">
        </picture>
        <p id="projectDescription">${data[0].Descripcion}</p>

    </div> 
    `;
}



fetch(`/api/student?id=${id}`)
  .then(response => response.json())
  .then(data => showData(data))
  .catch(error => {
    console.error(error);
  });
