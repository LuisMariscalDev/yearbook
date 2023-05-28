const lista = document.getElementById('lista');

function showData (data) {
    data.map((item) => {     

        lista.innerHTML += `
        <tr>
        <td>${item.Nombre}</td>
        <td>${item.Carrera}</td>
        <td>
        <a type="button" href="/modificar?id=${item.EstudianteID}" onclick="editUser(${item.EstudianteID})"><i class="bi bi-pencil-square"></i></a>
        </td>
        <td >
        <a type="button" href="/api/delete-student?id=${item.EstudianteID}" class="btn-close"></a>
        </td>
        <td>
        <a type="button" href="nosotros"><i class="bi bi-person-plus-fill"></i></a>
        </td>
        </tr>
         `;
    });
}

fetch(`/api/students`)
  .then(response => response.json())
  .then(data => showData(data))
  .catch(error => {
    console.error(error);
  });

function editUser (){
    document.getElementById("formu").style.display = "block";
    document.getElementById("btn-reg").style.display = "none";
    document.getElementById("btn-up").style.display = "block";

    fetch(`/api/students`)
    .then(response => response.json())
    .then(data => {
        document.getElementById("nombre").value=data[0].Nombre || "";
        document.getElementById("correo").value=data[0].Correo || "";
        document.getElementById("intereses").value=data[0].Intereses || "";
        document.getElementById("carrera").value=data[0].Carrera || "";
        document.getElementById("frase").value=data[0].Frase || "";
        document.getElementById("habilidades").value=data[0].Habilidades || "";
        document.getElementById("objetivos").value=data[0].Objetivos || "";
        document.getElementById("idestudiante").value=data[0].EstudianteID;
    })
    .catch(error =>{
        console.log(error);
    });
    editProject(id)
}

function editProject (){
    fetch(`/api/student/project`)
    .then(response => response.json())
    .then(data =>{
        document.getElementById("nombrepro").value=data[0].NombreProyecto;
        document.getElementById("proyectos").value=data[0].Descripcion;
        document.getElementById("idproyecto").value=data[0].ProyectoID;
    });
}

function actualizaInfo(){
    const idEstudiante = document.getElementById("idestudiante").value;
    const idproyecto = document.getElementById("idproyecto").value;


    const formDataEstudiante = new FormData(id);
    formDataEstudiante.appendChild("nombre", document.getElementById("nombre").value || "");
    formDataEstudiante.appendChild("correo", document.getElementById("correo").value || "");
    formDataEstudiante.appendChild("intereses", document.getElementById("intereses").value || "");
    formDataEstudiante.appendChild("carrera", document.getElementById("carrera").value || "");
    formDataEstudiante.appendChild("frase", document.getElementById("frase").value || "");
    formDataEstudiante.appendChild("habilidades", document.getElementById("habilidades").value || "");
    formDataEstudiante.appendChild("objetivos", document.getElementById("objetivos").value || "");

    fetch(`/actualizarEstudiante`, {
        
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data)
    }).catch((error) => {
        console.log(error)
    });


    const formDataProyecto = new FormData();
    formDataEstudiante.appendChild("nombrepro", document.getElementById("nombre").value || "");
    formDataEstudiante.appendChild("proyectos", document.getElementById("correo").value || "");


    fetch("/actualizarProyecto", {
        
        
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data)
    }).catch((error) => {
        console.log(error)
    });

    document.getElementById("btn-reg").style.display = "block";
    document.getElementById("btn-up").style.display = "none";
}