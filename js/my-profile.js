
let datosPerfil=document.getElementsByClassName("datosPerfil");
let contenedorDatos=document.getElementById("contenedorPerfil");
let nombre=document.getElementById("nombre");
let apellido=document.getElementById("apellido");
let email=document.getElementById("email");
let telefono=document.getElementById("telefono");
let btnEditar=document.getElementById("btnEditar");
let btnGuardar=document.getElementById("btnGuardar");
let imgPerfil=document.getElementById("imgPerfil");
let editarImg=document.getElementById("imgEditarPerfil");
let perfiles=document.getElementById("contenedorOpciones");
let ids=["op1","op2","op3","op4"];

window.addEventListener('DOMContentLoaded', () => {
  let imagenGuardada = localStorage.getItem('imagenSeleccionada');
  if (imagenGuardada) {
    imgPerfil.src = imagenGuardada;
  }
  nombre.value=localStorage.getItem('nombre');
  email.value=localStorage.getItem('usuario');
  apellido.value=localStorage.getItem('apellido');
  telefono.value=localStorage.getItem('telefono');

});

btnEditar.addEventListener("click", function () {
  for (let i = 0; i < datosPerfil.length; i++) {
    datosPerfil[i].readOnly = false;
    datosPerfil[i].style.border = "2px solid #4CAF50";
  }
    btnEditar.style.display="none";     //oculta el botón editar y aparece el guardar
    btnGuardar.style.display="flex";
    imgPerfil.style.display="none";   //se oculta la foto de perfil y aparece una con un lapiz que indica que se puede editar
    editarImg.style.display="flex";
});

btnGuardar.addEventListener("click", function () {
  for (let i = 0; i < datosPerfil.length; i++) {
    datosPerfil[i].readOnly = true;
    datosPerfil[i].style.border = "none";
    guardarDatos();
    }
    btnEditar.style.display="flex";
    btnGuardar.style.display="none";
    imgPerfil.style.display="flex";
    editarImg.style.display="none";
});


editarImg.addEventListener("click",function(){
    cambiarFotoPerfil();
    
})


function guardarDatos(){
    localStorage.setItem('nombre',nombre.value);
    localStorage.setItem('apellido',apellido.value);
    localStorage.setItem('telefono',telefono.value);
}

function cambiarFotoPerfil(){
    perfiles.style.display="flex"; //foto de perfil elegida desde las opciones
    contenedorDatos.style.display="none";
    ids.forEach(function(id) {
        let imagenElegida = document.getElementById(id);
        imagenElegida.addEventListener("click", function() {
            let imagenSrc = imagenElegida.src;
            localStorage.setItem("imagenSeleccionada", imagenSrc);
            perfiles.style.display="none";
            contenedorDatos.style.removeProperty("display");
            imgPerfil.src=localStorage.getItem('imagenSeleccionada');
            imgPerfil.style.display="flex";
            editarImg.style.display="none";
        });
});

const inputFoto = document.getElementById("fotoSubida");  //Foto de perfil subida
    inputFoto.addEventListener("change", (event) => {
        const archivo = event.target.files[0];
        if (archivo) {
            const lector = new FileReader(); //para poder guardarla en localStorage
            lector.onload = (e) => {
                const imagenSrc = e.target.result;
                // Guardar la imagen en localStorage
                localStorage.setItem("imagenSeleccionada", imagenSrc);
                // Actualizar la imagen
                imgPerfil.src = imagenSrc;
                imgPerfil.style.display = "flex";
                editarImg.style.display = "none";
                perfiles.style.display = "none";
                contenedorDatos.style.removeProperty("display");
            };
            lector.readAsDataURL(archivo); // convierte la imagen en Base64
        }


})
}


function cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('telefono');
    localStorage.removeItem('nombre');
    localStorage.removeItem('apellido');
     window.location.href = 'login.html';
}

if (!localStorage.getItem("loggedIn")) {
      // Si no hay sesión iniciada, redirigir a login.html
       alert("⚠️ Debes iniciar sesión para acceder a esta página");
      window.location.href = "login.html";
}