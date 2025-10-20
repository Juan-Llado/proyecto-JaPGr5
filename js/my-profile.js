
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


btnEditar.addEventListener("click", function () {
  for (let i = 0; i < datosPerfil.length; i++) {
    datosPerfil[i].readOnly = false;
    datosPerfil[i].style.border = "2px solid #4CAF50";
  }
    btnEditar.style.display="none";
    btnGuardar.style.display="flex";
    imgPerfil.style.display="none";
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
    imgPerfil.src=localStorage.getItem('imagenSeleccionada');
})


function guardarDatos(){
    localStorage.setItem('nombre',nombre.value);
    localStorage.setItem('apellido',apellido.value);
    localStorage.setItem('email',email.value);
    localStorage.setItem('telefono',telefono.value);
}

function cambiarFotoPerfil(){
    perfiles.style.display="flex";
    contenedorDatos.style.display="none";
    ids.forEach(function(id) {
        let imagenElegida = document.getElementById(id);
        imagenElegida.addEventListener("click", function() {
            let imagenSrc = imagenElegida.src;
            localStorage.setItem("imagenSeleccionada", imagenSrc);
            perfiles.style.display="none";
            contenedorDatos.style.removeProperty("display");
            imgPerfil.style.display="flex";
            editarImg.style.display="none";
        });
});

}
document.addEventListener("DOMContentLoaded", () => {
 
  const savedImage = localStorage.getItem("profileImage");
  if (savedImage) {
    document.getElementById("profileImage").src = savedImage;
  }
  document.getElementById("profileImageInput").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageData = e.target.result;
        localStorage.setItem("profileImage", imageData);
        document.getElementById("profileImage").src = imageData;
      };
      reader.readAsDataURL(file);
    }
  });
});

