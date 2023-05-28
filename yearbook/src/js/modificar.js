const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

fetch(`/api/student?id=${id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("nombre").value = data[0].Nombre || "";
        document.getElementById("correo").value = data[0].Correo || "";
        document.getElementById("intereses").value = data[0].Intereses || "";
        document.getElementById("carrera").value = data[0].Carrera || "";
        document.getElementById("frase").value = data[0].Frase || "";
        document.getElementById("habilidades").value = data[0].Habilidades || "";
        document.getElementById("objetivos").value = data[0].Objetivos || "";
        document.getElementById("idestudiante").value = data[0].EstudianteID;
    })
    .catch(error => {
        console.log(error);
    });

function actualizaInfo() {
    const formDataEstudiante = new FormData();
    formDataEstudiante.append("id", id);
    formDataEstudiante.append("nombre", document.getElementById("nombre").value || "");
    formDataEstudiante.append("correo", document.getElementById("correo").value || "");
    formDataEstudiante.append("intereses", document.getElementById("intereses").value || "");
    formDataEstudiante.append("carrera", document.getElementById("carrera").value || "");
    formDataEstudiante.append("frase", document.getElementById("frase").value || "");
    formDataEstudiante.append("habilidades", document.getElementById("habilidades").value || "");
    formDataEstudiante.append("objetivos", document.getElementById("objetivos").value || "");

    fetch(`/api/actualizarEstudiante`, {
        method: 'POST',
        body: formDataEstudiante,
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.log(error);
        });
}
