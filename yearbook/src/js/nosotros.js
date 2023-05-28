const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");
const registro = document.getElementById("register");

function showData(data) {
    registro.innerHTML = `
    
    `;
}

fetch(`/api/student?id=${id}`)
  .then(response => response.json())
  .then(data => showData(data))
  .catch(error => {
    console.error(error);
  });


