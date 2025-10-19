//Modo Oscuro
let inputModoOscuro=document.getElementById("check");
let icono=document.querySelector(".icono")
let modo=localStorage.getItem('modo');

inputModoOscuro.addEventListener("change", function() {
  if (inputModoOscuro.checked) {
    document.body.classList.add("modoOscuro");
    icono.className="bi bi-moon-fill icono";
    localStorage.setItem('modo','oscuro');
  } else {
    document.body.classList.remove("modoOscuro");
    icono.className="bi bi-brightness-high-fill icono";
    localStorage.removeItem('modo');
  }
});



if (modo==='oscuro'){
  document.body.classList.add("modoOscuro");
  icono.className="bi bi-moon-fill icono";
}