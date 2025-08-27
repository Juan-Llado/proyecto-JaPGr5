document.addEventListener('DOMContentLoaded', function () {
  // Datos del JSON proporcionado
  const categoryData = {
    "catID": 101,
    "catName": "Autos",
    "products": [
      {
        "id": 50921,
        "name": "Chevrolet Onix Joy",
        "description": "Generación 2019, variedad de colores. Motor 1.0, ideal para ciudad.",
        "cost": 13500,
        "currency": "USD",
        "soldCount": 14,
        "image": "img/prod50921_1.jpg"
      },
      {
        "id": 50922,
        "name": "Fiat Way",
        "description": "La versión de Fiat que brinda confort y a un precio accesible.",
        "cost": 14500,
        "currency": "USD",
        "soldCount": 52,
        "image": "img/prod50922_1.jpg"
      },
      {
        "id": 50923,
        "name": "Suzuki Celerio",
        "description": "Un auto que se ha ganado la buena fama por su economía con el combustible.",
        "cost": 12500,
        "currency": "USD",
        "soldCount": 25,
        "image": "img/prod50923_1.jpg"
      },
      {
        "id": 50924,
        "name": "Peugeot 208",
        "description": "El modelo de auto que se sigue renovando y manteniendo su prestigio en comodidad.",
        "cost": 15200,
        "currency": "USD",
        "soldCount": 17,
        "image": "img/prod50924_1.jpg"
      },
      {
        "id": 50925,
        "name": "Bugatti Chiron",
        "description": "El mejor hiperdeportivo de mundo. Producción limitada a 500 unidades.",
        "cost": 3500000,
        "currency": "USD",
        "soldCount": 0,
        "image": "img/prod50925_1.jpg"
      }
    ]
  };

  const productosContainer = document.getElementById('productos-container');
  const categoryTitle = document.getElementById('category-title');

  // Mostrar el nombre de la categoría
  categoryTitle.textContent = categoryData.catName;

  // Función para formatear el precio
  function formatPrice(cost, currency) {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cost);
  }

  // Función para renderizar los productos
  function renderizarProductos(products) {
    productosContainer.innerHTML = '';

    products.forEach(producto => {
      const productoHTML = `
        <div class="col-md-4 col-sm-6 mb-4">
          <div class="card producto-card h-100">
            <img src="${producto.image}" class="card-img-top producto-imagen" alt="${producto.name}" onerror="this.src='img/no-image.jpg'">
            <div class="card-body producto-body">
              <h5 class="card-title producto-titulo">${producto.name}</h5>
              <p class="card-text producto-descripcion">${producto.description}</p>
              <p class="producto-precio">${formatPrice(producto.cost, producto.currency)}</p>
              <p class="producto-vendidos">
                <i class="bi bi-people-fill"></i> ${producto.soldCount} vendidos
              </p>
             <button class="btn btn-primary w-100 btn-detalles">
                   <i class="bi bi-box-arrow-up-right"></i> Ver detalles
              </button>
            </div>
          </div>
        </div>
      `;

      productosContainer.innerHTML += productoHTML;
    });
  }

  // Función para ordenar productos
  function ordenarProductos(criterio) {
    const productos = [...categoryData.products];

    switch (criterio) {
      case 'relevantes':
        return productos.sort((a, b) => b.soldCount - a.soldCount);
      case 'precio-asc':
        return productos.sort((a, b) => a.cost - b.cost);
      case 'precio-desc':
        return productos.sort((a, b) => b.cost - a.cost);
      case 'nombre-asc':
        return productos.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return productos;
    }
  }

  // Manejar el cambio en el dropdown de ordenamiento
  document.getElementById('sort-dropdown').addEventListener('change', function (e) {
    const productosOrdenados = ordenarProductos(e.target.value);
    renderizarProductos(productosOrdenados);
  });

  // Renderizar productos inicialmente (ordenados por más vendidos)
  renderizarProductos(ordenarProductos('relevantes'));
});
