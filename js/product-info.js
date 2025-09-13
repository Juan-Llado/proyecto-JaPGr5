let productoID=localStorage.getItem("id");
let info=document.getElementById("info")
let carrusel=document.getElementById("contImg");
let divPrincipal=document.getElementById("columna1");

    fetch(`https://japceibal.github.io/emercado-api/products/${productoID}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo cargar la información del producto');
        }
        return response.json();
      })
      .then(producto => {
      window.imagenes= Object.values(producto.images).filter(img => typeof img==="string");
      console.log(window.imagenes);
      info.className = "col-md-4 col-sm-6 mb-4";
      info.innerHTML=`
            <div>
              <h5>${producto.name}</h5>
              <p>${producto.description}</p>
              <p>${producto.cost} ${producto.currency}</p>
              <p>
                <i class="bi bi-people-fill"></i> ${producto.soldCount} vendidos
              </p>
              <botton class="bi bi-cart-plus" id="agregarCarrito"></botton>
            </div>
      `; cargarImagenes(window.imagenes);
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
            imagen.classList.add("d-block","w-100");
            divImg.appendChild(imagen);
            carrusel.appendChild(divImg);
        }
    
    });
}