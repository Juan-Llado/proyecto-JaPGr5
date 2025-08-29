// products.js

document.addEventListener('DOMContentLoaded', function () {
  // Mostrar el email del usuario almacenado en localStorage
  const usuario = localStorage.getItem('usuario');
  if (usuario) {
    document.getElementById('userEmail').textContent = usuario;
  }

  const productosContainer = document.getElementById('productos-container');
  const categoryTitle = document.getElementById('category-title');
  const sortDropdown = document.getElementById('sort-dropdown');
  
  // Obtener el catID de la URL o usar valor por defecto
  const urlParams = new URLSearchParams(window.location.search);
  let catID = urlParams.get('catID');
  
  // Si no hay catID en la URL, usar el valor por defecto (101)
  if (!catID) {
    catID = 101;
  }

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

    if (products.length === 0) {
      productosContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-exclamation-circle" style="font-size: 3rem;"></i>
          <h4 class="mt-3">No hay productos en esta categoría</h4>
        </div>
      `;
      return;
    }

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
  function ordenarProductos(products, criterio) {
    const productos = [...products];

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

  // Función para cargar los datos de la categoría
  function cargarCategoria(catID) {
    // Mostrar indicador de carga
    productosContainer.innerHTML = `
      <div class="col-12 text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3">Cargando productos...</p>
      </div>
    `;

    // Hacer la solicitud a la API
    fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo cargar la categoría');
        }
        return response.json();
      })
      .then(categoryData => {
        // Mostrar el nombre de la categoría
        categoryTitle.textContent = categoryData.catName;

        // Guardar los productos para poder ordenarlos después
        window.currentProducts = categoryData.products;

        // Renderizar productos inicialmente (ordenados por más vendidos)
        const productosOrdenados = ordenarProductos(window.currentProducts, 'relevantes');
        renderizarProductos(productosOrdenados);
      })
      .catch(error => {
        console.error('Error:', error);
        productosContainer.innerHTML = `
          <div class="col-12 text-center py-5">
            <i class="bi bi-exclamation-triangle" style="font-size: 3rem;"></i>
            <h4 class="mt-3">Error al cargar los productos</h4>
            <p>${error.message}</p>
            <button class="btn btn-primary mt-3" onclick="cargarCategoria(${catID})">
              Reintentar
            </button>
          </div>
        `;
      });
  }

  // Manejar el cambio en el dropdown de ordenamiento
  sortDropdown.addEventListener('change', function (e) {
    if (window.currentProducts) {
      const productosOrdenados = ordenarProductos(window.currentProducts, e.target.value);
      renderizarProductos(productosOrdenados);
    }
  });

  // Función para cerrar sesión
  window.logout = function() {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
  };

  // Iniciar la carga de la categoría
  cargarCategoria(catID);
});
