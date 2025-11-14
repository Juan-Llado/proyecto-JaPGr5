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

    function actualizarContadorCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let totalProductos = 0;
    
    carrito.forEach(producto => {
      totalProductos += producto.quantity || 1;
    });
    
    const badge = document.getElementById("contadorCarrito");
    if (badge) {
      badge.textContent = totalProductos;
      if (totalProductos === 0) {
        badge.style.display = "none";
      } else {
        badge.style.display = "inline";
      }
    }
  }

  actualizarContadorCarrito();

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

        actualizarContadorCarrito();
      }
    });
  });


  // actualizar el total
  function actualizarTotal() {
    let total = 0;
    let moneda = "";
    
    carrito.forEach(producto => {
      total += producto.cost * producto.quantity;
      if (!moneda) moneda = producto.currency;
    });
    
    document.getElementById("total-carrito").textContent = `${moneda} ${total.toFixed(2)}`;
  // sección de Total y botón Comprar
  document.getElementById("btn-comprar").addEventListener("click", () => {
  // Validar dirección
  const departamento = document.getElementById("departamento")?.value.trim();
  const localidad = document.getElementById("localidad")?.value.trim();
  const calle = document.getElementById("calle")?.value.trim();
  const numero = document.getElementById("numero")?.value.trim();
  const esquina = document.getElementById("esquina")?.value.trim();

  if (!departamento || !localidad || !calle || !numero || !esquina) {
    alert("Por favor completá todos los campos de dirección.");
    return;
  }

  // Validar tipo de envío
  const tipoEnvio = document.querySelector('input[name="envio"]:checked');
  if (!tipoEnvio) {
    alert("Seleccioná un tipo de envío.");
    return;
  }

  // Validar cantidades
  const cantidades = document.querySelectorAll('.cantidad-input');
  let cantidadesValidas = true;
  cantidades.forEach(input => {
    const valor = parseInt(input.value);
    if (isNaN(valor) || valor <= 0) {
      cantidadesValidas = false;
    }
  });
  if (!cantidadesValidas) {
    alert("La cantidad de cada producto debe ser mayor a 0.");
    return;
  }

  // Validar forma de pago
  const formaPago = document.querySelector('input[name="pago"]:checked');
  if (!formaPago) {
    alert("Seleccioná una forma de pago.");
    return;
  }

  let pagoValido = false;
  if (formaPago.value === "tarjeta") {
    const numeroTarjeta = document.getElementById("numeroTarjeta")?.value.trim();
    const vencimiento = document.getElementById("vencimiento")?.value.trim();
    const codigo = document.getElementById("codigo")?.value.trim();
    pagoValido = numeroTarjeta && vencimiento && codigo;
  } else if (formaPago.value === "transferencia") {
    const cuenta = document.getElementById("cuentaBancaria")?.value.trim();
    pagoValido = cuenta;
  } else if (formaPago.value === "efectivo") {
  const nombreEfectivo = document.getElementById("nombreEfectivo")?.value.trim();
  pagoValido = nombreEfectivo;
  }


 if (!pagoValido || pagoValido.length === 0) {
  alert("Completá todos los campos de la forma de pago seleccionada.");
  return;
}


  // Si todo está validado
  const totalElement = document.getElementById("total-carrito").textContent;
  alert(`¡Compra realizada con éxito!\nTotal: ${totalElement}\n\nGracias por tu compra.`);
});


 function actualizarTotal() {
  let subtotal = 0;
  let moneda = "";

  carrito.forEach(producto => {
    subtotal += producto.cost * producto.quantity;
    if (!moneda) moneda = producto.currency;
  });

  const envioSeleccionado = document.querySelector('input[name="envio"]:checked');
  let recargo = 0;
  if (envioSeleccionado) {
    recargo = parseFloat(envioSeleccionado.dataset.recargo);
  }

  const costoEnvio = subtotal * recargo;
  const totalFinal = subtotal + costoEnvio;

  document.getElementById("total-carrito").textContent = `${moneda} ${totalFinal.toFixed(2)}`;
}
document.querySelectorAll('input[name="envio"]').forEach(radio => {
  radio.addEventListener("change", actualizarTotal);
});


  // Calcular total inicial
  actualizarTotal();


});




