const CATEGORIES_URL = "http://localhost:3000/api/categorias";
const PUBLISH_PRODUCT_URL = "http://localhost:3000/api/publish";
const PRODUCTS_URL = "http://localhost:3000/api/categorias";
const PRODUCT_INFO_URL = "http://localhost:3000/api/infoProducto";
const PRODUCT_INFO_COMMENTS_URL = "http://localhost:3000/api/products_comments";
const CART_INFO_URL = "http://localhost:3000/api/cart";
const CART_BUY_URL = "http://localhost:3000/api/cats";
const EXT_TYPE = ".json";

let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function(url){
    let result = {};
    showSpinner();
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          hideSpinner();
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        hideSpinner();
        return result;
    });
}

// Función para actualizar el contador del carrito en el badge
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let totalProductos = 0;
  
  // Sumar todas las cantidades de productos
  carrito.forEach(producto => {
    totalProductos += producto.quantity || 1;
  });
  
  // Actualizar el badge
  const badge = document.getElementById("contadorCarrito");
  if (badge) {
    badge.textContent = totalProductos;
    
    // Opcional: ocultar el badge si no hay productos
    if (totalProductos === 0) {
      badge.style.display = "none";
    } else {
      badge.style.display = "inline";
    }
  }
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);