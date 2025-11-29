
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
    // Hacer petición POST al backend
    fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usuario, password })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Error en el login");
      }
      return response.json();
    })
    .then(data => {
      if (data.token) {
        // Guardar el token en localStorage
        localStorage.setItem("token", data.token);
        
        // Guardar usuario en localStorage
        localStorage.setItem("usuario", usuario);

        // Guardar flag de sesión
        localStorage.setItem("loggedIn", true);

        // Redirigir a index.html
        window.location.href = "index.html";
      } else {
        alert("No se recibió el token del servidor");
      }
    })
    .catch(error => {
      console.error("Error en login:", error);
      alert("Error al iniciar sesión. Por favor, verifica tus credenciales.");
    });
  }
});
