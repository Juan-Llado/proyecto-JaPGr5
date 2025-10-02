
let productoID=localStorage.getItem("id");
let info=document.getElementById("info")
let carrusel=document.getElementById("contImg");
let divPrincipal=document.getElementById("columna1");
let contadorCarrito=document.getElementById("contadorCarrito");
let iconoCarrito=document.getElementById("carritoNav");
let desplegableCarrito=document.getElementById("desplegableCarrito");
let estrellas=document.querySelectorAll(".estrella");
let btnEnviarComentario=document.getElementById("btnEnviarComentario");


    fetch(`https://japceibal.github.io/emercado-api/products/${productoID}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo cargar la información del producto');
        }
        return response.json();
      })
      .then(producto => {
      window.imagenes= Object.values(producto.images).filter(img => typeof img==="string"); //guardo url de las imagenes en un array.
      info.innerHTML=`
              <h5>${producto.name}</h5>
              <p class="estiloInfo">${producto.description}</p>
              <p class="estiloInfo"  id="vendidos">
                <i class="bi bi-people-fill"></i> ${producto.soldCount} vendidos
              </p>
              <p id="precio">${producto.cost} ${producto.currency}</p>
              <button class="btn ${clase}" id="agregarCarrito" data-id=${producto.id}></button>  
              
      `; //uso el atributo data-* (*en este caso lo llame id) en vez de solo id para poder relacionar cada botón a
      // su id correspodiente y asi poder guardar el icono de agregado,o no, para cada uno.
      cargarImagenes(window.imagenes);
      document.getElementById("agregarCarrito").addEventListener("click", () => {
          carrito(producto);
      });
      
      restaurarIconosCarrito();
      
  
      fetch(`https://japceibal.github.io/emercado-api/products_comments/${productoID}.json`)
  .then(response => {
    if (!response.ok) {
      throw new Error('No se pudieron cargar los comentarios');
    }
    return response.json();
  })
  .then(comentarios => {
    mostrarComentarios(comentarios);
  })
  .catch(error => {
    console.error('Error al cargar comentarios:', error);
  });

    })
      .catch(error => {
        console.error('Error:', error);
        info.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
            <h4 class="mt-3">Error al cargar los datos del productos</h4>
            <p>${error.message}</p>
            <button class="btn btn-primary mt-3" onclick="cargarCategoria(${productoID})">
              Reintentar
            </button>
          </div>
        `;
     

      });


window.cargarImagenes=function cargarImagenes(imagenes){
    carrusel.innerHTML="";    /*Limpio el contenido anterior */
    imagenes.forEach((src, indice)=> {   //indice de la imagen en el arreglo
      let divImg=document.createElement("div");
      divImg.classList.add("carousel-item");
      if (indice===0){
        divImg.classList.add("active"); //clase necesaria en el primer elemento para que funcione el carrusel con Boostrap
      }
      let imagen=document.createElement("img");      /*Recorro el arreglo (imagenes) que tiene los src */
        if(src){                    /*src lo elijo como clave,podria ser cualquier cosa */
            imagen.src=src;   /*Le asigno a el atributo src de img el src obtenido del fetch, los cuales puse en el arreglo */
            imagen.classList.add("d-block","w-100","imagenes");
            divImg.appendChild(imagen);
            carrusel.appendChild(divImg);
        }
    
    });
}


let contador = parseInt(localStorage.getItem('carritoContador')) || 0; //busco la variable contador en localStorage, si no esta la crea con valor 0.

function badgeCarrito(){    //se muestra sobre el carrito en la barra superior si hay productos agregados. 
  if (contador!=0){
    contadorCarrito.style.display="inline-block";
    contadorCarrito.innerHTML=contador;
  }else{
    contadorCarrito.style.display = "none";
    contadorCarrito.innerText = "";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  badgeCarrito();
})


let clase="bi-cart-plus";

window.prodCarrito = JSON.parse(localStorage.getItem("carrito")) || []; //creo un array para guardar los elementos que se agregan al carrito si no existe.

function carrito(producto) {
   
  let btn = document.getElementById("agregarCarrito");
  let indice = prodCarrito.findIndex(p => p.id === producto.id);  //busco el indice del producto en el array que contiene todos los elementos del carrito

  if (indice !== -1) { //el producto ya esta en el carrito
    prodCarrito.splice(indice, 1); //elimino el producto del array
    btn.className = "btn bi bi-cart-plus"; 
  } else {
    prodCarrito.push(producto); //si no esta lo agrego al carrito
    btn.className = "btn bi bi-cart-check-fill";
  }

  contador = prodCarrito.length; 
  localStorage.setItem("carrito", JSON.stringify(prodCarrito)); //guardo el nuevo carrito
  localStorage.setItem("carritoContador", contador);        //guardo el contador
  badgeCarrito();
}


function restaurarIconosCarrito() {
  let prodCarrito = JSON.parse(localStorage.getItem("carrito")) || []; 
  let btn = document.getElementById("agregarCarrito");
  let productoID = parseInt(btn.dataset.id); //lo convierto en un número para poder compararlo,porque los data se guardan como string.
  
  if (prodCarrito.some(prod => prod.id === productoID)) {
    btn.className = "btn bi bi-cart-check-fill activo";
  } else {
    btn.className = "btn bi bi-cart-plus";
  }
}


// Función para cerrar sesión
  window.logout = function() {
    localStorage.clear();
    window.location.href = 'index.html';
  };


  function mostrarComentarios(comentarios) {
  const contenedorComentarios = document.getElementById("comentarios");

  contenedorComentarios.innerHTML = "";

  comentarios.forEach(comentario => {
    const div = document.createElement("div");
    div.classList.add("comentario");

    div.innerHTML = `
      <p><strong>${comentario.user}</strong> - ${comentario.dateTime}</p>
      <p class="estrellas">${"★".repeat(comentario.score)}${"☆".repeat(5 - comentario.score)}</p>
      <p>${comentario.description}</p>
      <hr>
    `;

    contenedorComentarios.appendChild(div);
  });
}
