const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

fetch(`/api/student?id=${id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("nombrepro").value = data[0].Nombre || "";
        document.getElementById("proyectos").value = data[0].Correo || "";
        document.getElementById("idestudiante").value = data[0].EstudianteID;
    })
    .catch(error => {
        console.log(error);
    });

function modificarProyecto(){
    const formDataProyecto = new FormData();
    formDataProyecto.append("id", id);
    formDataProyecto.append("nombrepro", document.getElementById("nombre").value || "");
    formDataProyecto.append("proyectos", document.getElementById("proyectos").value || "");

    fetch(`/api/actualizarproyecto`, {
        method: 'POST',
        body: formDataProyecto,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });
}