document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const emptyMessage = document.getElementById("empty-message");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  carrito.forEach(p => {
  if (!p.quantity || p.quantity < 1) {
    p.quantity = 1;
  }
});
localStorage.setItem("carrito", JSON.stringify(carrito));

  
  if (carrito.length === 0) {
    emptyMessage.classList.remove("d-none");
    return;
  }

  carrito.forEach((producto, index) => {
    const itemHTML = `
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${producto.images[0]}" class="img-fluid rounded-start" alt="${producto.name}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${producto.name}</h5>
              <p class="card-text">Precio: ${producto.currency} ${producto.cost}</p>
              <label for="cantidad-${index}">Cantidad:</label>
              <input type="number" id="cantidad-${index}" class="form-control cantidad-input" min="1" value="${producto.quantity || 1}" data-index="${index}">
               <p class="subtotal mt-2">Subtotal: ${producto.currency} ${(producto.cost * producto.quantity).toFixed(2)}</p>
           
          </div>
        </div>
      </div>
    `;
    cartContainer.insertAdjacentHTML("beforeend", itemHTML);
  });

  // Actualizar subtotal en tiempo real
  document.querySelectorAll(".cantidad-input").forEach(input => {
    input.addEventListener("input", (e) => {
      const index = e.target.dataset.index;
      const nuevaCantidad = parseInt(e.target.value);
      const producto = carrito[index];

      if (nuevaCantidad > 0) {
        producto.quantity = nuevaCantidad;
        localStorage.setItem("carrito", JSON.stringify(carrito));

        const subtotalElement = e.target.closest(".card-body").querySelector(".subtotal");
        subtotalElement.textContent = `Subtotal: ${producto.currency} ${producto.cost * nuevaCantidad}`;
        actualizarTotal();
      }
    });
  });

  // sección de Total y botón Comprar
  const totalHTML = `
    <div class="card mt-4 bg-light">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <h4 class="mb-0">Total:</h4>
          <h3 class="mb-0 text-success" id="total-carrito">$0.00</h3>
        </div>
        <button class="btn btn-primary btn-lg w-100 mt-3" id="btn-comprar">
          <i class="fa fa-shopping-cart"></i> Finalizar Compra
        </button>
      </div>
    </div>
  `;
  cartContainer.insertAdjacentHTML("beforeend", totalHTML);

  // actualizar el total
  function actualizarTotal() {
    let total = 0;
    let moneda = "";
    
    carrito.forEach(producto => {
      total += producto.cost * producto.quantity;
      if (!moneda) moneda = producto.currency;
    });
    
    document.getElementById("total-carrito").textContent = `${moneda} ${total.toFixed(2)}`;
  }

  // Calcular total inicial
  actualizarTotal();

  // Evento del botón Comprar
  document.getElementById("btn-comprar").addEventListener("click", () => {
    const totalElement = document.getElementById("total-carrito").textContent;
    alert(`¡Compra realizada con éxito!\nTotal: ${totalElement}\n\nGracias por tu compra.`);
  });
  
});




