
let productoID=localStorage.getItem("id");
let info=document.getElementById("info")
let carrusel=document.getElementById("contImg");
let divPrincipal=document.getElementById("columna1");
let contadorCarrito=document.getElementById("contadorCarrito");
let iconoCarrito=document.getElementById("carritoNav");
let desplegableCarrito=document.getElementById("desplegableCarrito");
let estrellas=document.querySelectorAll(".estrella");
let btnEnviarComentario=document.getElementById("btnEnviarComentario");
let fotoPerfil=document.getElementById("perfil");


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
      
      // Mostrar productos relacionados
      if (producto.relatedProducts && producto.relatedProducts.length > 0) {
        mostrarProductosRelacionados(producto.relatedProducts);
      }
  
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


// Mostrar productos relacionados
function mostrarProductosRelacionados(productosRelacionados) {
  const contenedorRelacionados = document.getElementById("productos-relacionados");
  
  // Limpiar contenido previo
  contenedorRelacionados.innerHTML = "";
  
  // Crear título de la seccion
  const titulo = document.createElement("h3");
  titulo.textContent = "Productos Relacionados";
  titulo.className = "titulo-relacionados";
  contenedorRelacionados.appendChild(titulo);
  
  // Crear contenedor para las tarjetass
  const gridRelacionados = document.createElement("div");
  gridRelacionados.className = "grid-relacionados";
  
  // Crear una tarjeta por cada producto relacionado
  productosRelacionados.forEach(producto => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-relacionado";
    tarjeta.style.cursor = "pointer";
    
    tarjeta.innerHTML = `
      <img src="${producto.image}" 
           alt="${producto.name}" 
           class="img-relacionado"
           onerror="this.src='img/no-image.jpg'">
      <h5 class="nombre-relacionado">${producto.name}</h5>
    `;
    
    // Agregar evento click para redirigir al producto
    tarjeta.addEventListener("click", () => {
      localStorage.setItem("id", producto.id);
      window.location.href = "product-info.html";
    });
    
    gridRelacionados.appendChild(tarjeta);
  });
  
  contenedorRelacionados.appendChild(gridRelacionados);
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


//foto de perfil
fotoPerfil.src=localStorage.getItem('imagenSeleccionada')

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

// Función para mostrar comentarios 
function mostrarComentarios(comentarios) {
  const contenedorComentarios = document.getElementById("comentarios");
  contenedorComentarios.innerHTML = "";

  // Crear el contenedor principal con título
  const tituloComentarios = document.createElement("div");
  tituloComentarios.className = "container mt-5";
  tituloComentarios.innerHTML = `<h3 class="mb-4">Comentarios y Calificaciones</h3>`;
  contenedorComentarios.appendChild(tituloComentarios);

  // Contenedor para los comentarios
  const listaComentarios = document.createElement("div");
  listaComentarios.className = "container";
  listaComentarios.id = "listaComentarios";

  // Cargar comentario del usuario desde localStorage 
  const comentarioUsuario = JSON.parse(localStorage.getItem(`comentario_${productoID}`));
  
  if (comentarioUsuario) {
    const divUsuario = document.createElement("div");
    divUsuario.classList.add("comentario", "comentario-usuario");
    divUsuario.innerHTML = `
      <p><strong>${comentarioUsuario.user}</strong> <span class="badge bg-primary">Tu comentario</span> - ${comentarioUsuario.dateTime}</p>
      <p class="estrellas">${"★".repeat(comentarioUsuario.score)}${"☆".repeat(5 - comentarioUsuario.score)}</p>
      <p>${comentarioUsuario.description}</p>
      <hr>
    `;
    listaComentarios.appendChild(divUsuario);
  }

  // Mostrar comentarios existentes
  comentarios.forEach(comentario => {
    const div = document.createElement("div");
    div.classList.add("comentario");
    div.innerHTML = `
      <p><strong>${comentario.user}</strong> - ${comentario.dateTime}</p>
      <p class="estrellas">${"★".repeat(comentario.score)}${"☆".repeat(5 - comentario.score)}</p>
      <p>${comentario.description}</p>
      <hr>
    `;
    listaComentarios.appendChild(div);
  });

  contenedorComentarios.appendChild(listaComentarios);

  // Agregar formulario de calificación solo si el usuario no ha calificado
  if (!comentarioUsuario) {
    agregarFormularioCalificacion();
  }
}

// Función para agregar el formulario de calificación
function agregarFormularioCalificacion() {
  const contenedorComentarios = document.getElementById("comentarios");
  
  const formulario = document.createElement("div");
  formulario.className = "container mt-5 mb-5";
  formulario.innerHTML = `
    <div class="card shadow-sm">
      <div class="card-body">
        <h4 class="card-title mb-4">Deja tu calificación</h4>
        
        <div class="mb-3">
          <label class="form-label fw-bold">Tu puntuación:</label>
          <div class="estrellas-calificacion" id="estrellasCalificacion">
            <i class="bi bi-star estrella" data-value="1"></i>
            <i class="bi bi-star estrella" data-value="2"></i>
            <i class="bi bi-star estrella" data-value="3"></i>
            <i class="bi bi-star estrella" data-value="4"></i>
            <i class="bi bi-star estrella" data-value="5"></i>
          </div>
          <small class="text-muted d-block mt-2" id="mensajeCalificacion">Selecciona una calificación</small>
        </div>

        <div class="mb-3">
          <label for="comentarioTexto" class="form-label fw-bold">Tu comentario:</label>
          <textarea class="form-control" id="comentarioTexto" rows="3" placeholder="Cuéntanos tu experiencia con este producto..."></textarea>
        </div>

        <button class="btn btn-secondary" id="btnEnviarCalificacion" disabled>
          Enviar
        </button>
      </div>
    </div>
  `;
  
  contenedorComentarios.appendChild(formulario);
  inicializarCalificacion();
}

// Función para inicializar la funcionalidad de las estrellas
function inicializarCalificacion() {
  const estrellas = document.querySelectorAll('.estrella');
  const btnEnviar = document.getElementById('btnEnviarCalificacion');
  const mensajeCalificacion = document.getElementById('mensajeCalificacion');
  let calificacionSeleccionada = 0;

  // Hover sobre las estrellas
  estrellas.forEach((estrella, index) => {
    estrella.addEventListener('mouseenter', () => {
      estrellas.forEach((e, i) => {
        if (i <= index) {
          e.classList.remove('bi-star');
          e.classList.add('bi-star-fill');
        } else {
          e.classList.remove('bi-star-fill');
          e.classList.add('bi-star');
        }
      });
    });

    // Click en la estrella
    estrella.addEventListener('click', () => {
      calificacionSeleccionada = parseInt(estrella.dataset.value);
      btnEnviar.disabled = false;
      
      // Actualizar mensaje
      const mensajes = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];
      mensajeCalificacion.textContent = `${calificacionSeleccionada} ${calificacionSeleccionada === 1 ? 'estrella' : 'estrellas'} - ${mensajes[calificacionSeleccionada - 1]}`;
      mensajeCalificacion.style.color = '#198754';
    });
  });

  // Mouseleave del contenedor de estrellas
  document.getElementById('estrellasCalificacion').addEventListener('mouseleave', () => {
    estrellas.forEach((e, i) => {
      if (i < calificacionSeleccionada) {
        e.classList.remove('bi-star');
        e.classList.add('bi-star-fill');
      } else {
        e.classList.remove('bi-star-fill');
        e.classList.add('bi-star');
      }
    });
  });

  // Enviar calificación
  btnEnviar.addEventListener('click', () => {
    const comentarioTexto = document.getElementById('comentarioTexto').value.trim();
    
    if (calificacionSeleccionada === 0) {
      alert('Por favor, selecciona una calificación');
      return;
    }

    if (comentarioTexto === '') {
      alert('Por favor, escribe un comentario');
      return;
    }

    // Crear objeto de comentario
    const nuevoComentario = {
      user: localStorage.getItem('userEmail') || 'Usuario',
      score: calificacionSeleccionada,
      description: comentarioTexto,
      dateTime: new Date().toLocaleString('es-UY', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    // Guardar en localStorage
    localStorage.setItem(`comentario_${productoID}`, JSON.stringify(nuevoComentario));

    // Mostrar mensaje de éxito
    btnEnviar.innerHTML = '¡Enviado!';
    btnEnviar.classList.remove('btn-secondary');
    btnEnviar.classList.add('btn-success');
    btnEnviar.disabled = true;

    // Recargar comentarios para mostrar el nuevo
    setTimeout(() => {
      fetch(`https://japceibal.github.io/emercado-api/products_comments/${productoID}.json`)
        .then(response => response.json())
        .then(comentarios => mostrarComentarios(comentarios))
        .catch(error => console.error('Error al recargar comentarios:', error));
    }, 1000);
  });
}