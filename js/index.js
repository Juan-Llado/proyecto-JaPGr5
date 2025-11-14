document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
 
});


    if (!localStorage.getItem("loggedIn")) {
      // Si no hay sesión iniciada, redirigir a login.html
       alert("⚠️ Debes iniciar sesión para acceder a esta página");
      window.location.href = "login.html";

    }


const usuarioGuardado = localStorage.getItem("usuario");
if(usuarioGuardado){
  // Selecciono el a de la li  que apunta a login.html
  const loginLink = document.querySelector('.navbar-nav a[href="login.html"]');
  loginLink.setAttribute('target', '_blank');

  loginLink.textContent = usuarioGuardado;
  loginLink.href = "my-profile.html";

}