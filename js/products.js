const div = document.getElementById("info");

let catID = 101;
fetch(`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
    .then(res => {
        console.log(res);
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
    })
    .then(data => {
        console.log(data);
        div.innerHTML = `<h1>${data.catName}</h1>`;
        
     
        const productosContainer = document.createElement('div');
        productosContainer.style.display = 'contents';
        div.appendChild(productosContainer);
        
        let i = 0;
        for (i = 0; i < data.products.length; i++) {
        
            const tarjeta = document.createElement('div');
            tarjeta.className = 'producto-tarjeta';
            
        
            tarjeta.innerHTML = `
                <img src="${data.products[i].image}" alt="Imagen del producto" class="producto-imagen">
                <p class="producto-nombre">${data.products[i].name}</p>
                <p class="producto-descripcion">${data.products[i].description}</p>
                <p class="producto-precio">${data.products[i].currency} ${data.products[i].cost}</p>
                <p class="producto-cantidad">Cantidad de artículos disponibles: ${data.products[i].soldCount}</p>
            `;
            
            productosContainer.appendChild(tarjeta);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        div.innerHTML += `<p>Error al cargar los productos: ${error.message}</p>`;
    });