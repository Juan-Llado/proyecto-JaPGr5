const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
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