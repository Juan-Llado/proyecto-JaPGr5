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

  // Crear elementos para el filtro con el dropdown
  const filterContainer = document.createElement('div');
  filterContainer.className = 'row mb-4';
  filterContainer.innerHTML = `
    <div class="col-md-12">
      <div class="card">
        <div class="card-body">
          <div class="row align-items-end">
            <div class="col-md-3">
              <label for="min-price" class="form-label">Precio mínimo</label>
              <input type="number" class="form-control" id="min-price" placeholder="Mínimo" min="0">
            </div>
            <div class="col-md-3">
              <label for="max-price" class="form-label">Precio máximo</label>
              <input type="number" class="form-control" id="max-price" placeholder="Máximo" min="0">
            </div>
            <div class="col-md-3">
              <label for="sort-dropdown" class="form-label">Ordenar por</label>
              <select class="form-select" id="sort-dropdown">
                <option value="relevantes">Más relevantes</option>
                <option value="precio-asc">Precio: menor a mayor</option>
                <option value="precio-desc">Precio: mayor a menor</option>
                <option value="nombre-asc">Nombre: A-Z</option>
                <option value="vendidos-asc">Vendidos: menor a mayor</option>
                <option value="vendidos-desc">Vendidos: mayor a menor</option>
              </select>
            </div>
            <div class="col-md-3">
              <button class="btn btn-primary w-100 mb-1" id="apply-filter">
                <i class="bi bi-funnel"></i> Aplicar filtros
              </button>
              <button class="btn btn-outline-secondary w-100" id="clear-filter">
                <i class="bi bi-x-circle"></i> Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Reemplazar el dropdown original con el nuevo contenedor
  if (sortDropdown && sortDropdown.parentNode) {
    sortDropdown.parentNode.replaceChild(filterContainer, sortDropdown);
  } else {
    // Si no existe el dropdown original, insertar el contenedor antes de los productos
    productosContainer.parentNode.insertBefore(filterContainer, productosContainer);
  }

  // Obtener referencias a los elementos después de crearlos
  const newSortDropdown = document.getElementById('sort-dropdown');
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const applyFilterBtn = document.getElementById('apply-filter');
  const clearFilterBtn = document.getElementById('clear-filter');

  // Función para formatear el precio
  function formatPrice(cost, currency) {
    return new Intl.NumberFormat('es-UY', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cost);
  }

  // Función para filtrar productos por rango de precio
  function filtrarPorPrecio(products, minPrice, maxPrice) {
    return products.filter(producto => {
      const precio = producto.cost;
      return (!minPrice || precio >= minPrice) && (!maxPrice || precio <= maxPrice);
    });
  }

  // Función para renderizar los productos
  function renderizarProductos(products) {
    productosContainer.innerHTML = '';

    if (products.length === 0) {
      productosContainer.innerHTML = `
        <div class="col-12 text-center py-5">
          <i class="bi bi-exclamation-circle" style="font-size: 3rem;"></i>
          <h4 class="mt-3">No hay productos que coincidan con los filtros</h4>
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
      case 'vendidos-asc':
        return productos.sort((a, b) => a.soldCount - b.soldCount);
      case 'vendidos-desc':
        return productos.sort((a, b) => b.soldCount - a.soldCount);
      default:
        return productos;
    }
  }

  // Función para aplicar todos los filtros
  function aplicarFiltrosYOrdenamiento() {
    if (!window.currentProducts) return;
    
    const minPrice = parseFloat(minPriceInput.value) || null;
    const maxPrice = parseFloat(maxPriceInput.value) || null;
    const ordenSeleccionado = newSortDropdown.value;
    
    // Validar que el mínimo no sea mayor que el máximo
    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      alert('El precio mínimo no puede ser mayor que el precio máximo');
      return;
    }
    
    // Aplicar filtro de precio
    window.filteredProducts = filtrarPorPrecio(window.currentProducts, minPrice, maxPrice);
    
    // Aplicar ordenamiento
    const productosOrdenados = ordenarProductos(window.filteredProducts, ordenSeleccionado);
    renderizarProductos(productosOrdenados);
  }

  // Función para limpiar todos los filtros
  function limpiarFiltros() {
    minPriceInput.value = '';
    maxPriceInput.value = '';
    newSortDropdown.value = 'relevantes';
    
    if (window.currentProducts) {
      window.filteredProducts = [...window.currentProducts];
      const productosOrdenados = ordenarProductos(window.filteredProducts, 'relevantes');
      renderizarProductos(productosOrdenados);
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
        window.filteredProducts = [...window.currentProducts];

        // Renderizar productos inicialmente (ordenados por más vendidos)
        const productosOrdenados = ordenarProductos(window.filteredProducts, 'relevantes');
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

  // Event listeners
  newSortDropdown.addEventListener('change', aplicarFiltrosYOrdenamiento);
  applyFilterBtn.addEventListener('click', aplicarFiltrosYOrdenamiento);
  clearFilterBtn.addEventListener('click', limpiarFiltros);

  // También aplicar filtros cuando se presiona Enter en los campos de precio
  minPriceInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') aplicarFiltrosYOrdenamiento();
  });
  
  maxPriceInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') aplicarFiltrosYOrdenamiento();
  });

  // Función para cerrar sesión
  window.logout = function() {
    localStorage.clear();
    window.location.href = 'index.html';
  };

  // Iniciar la carga de la categoría
  cargarCategoria(catID);
});
