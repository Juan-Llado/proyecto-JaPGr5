 const btn = document.getElementById("button-modebackground");
    btn.addEventListener("click", () => {
      const html = document.documentElement;
      const currentTheme = html.getAttribute("data-bs-theme");
      html.setAttribute("data-bs-theme", currentTheme === "dark" ? "light" : "dark");
    });

    // constantes para el evento
const loginForm = document.getElementById("loginForm");
const userInput = document.getElementById("user");   // es el id del input del correo
const passInput = document.getElementById("pass");   // es el id de la contraseña

// Evento submit del login
loginForm.addEventListener("submit", function(e){
  e.preventDefault(); // evita que recargue la página

  let usuario = userInput.value;
  let password = passInput.value;

  if(usuario && password){
    // Guardar usuario en localStorage
    localStorage.setItem("usuario", usuario);

    // Guardar flag de sesión
    localStorage.setItem("loggedIn", true);

    // Redirigir a index.html
    window.location.href = "index.html";
  }
});
