const div=document.getElementById("info");

let catID=101;
fetch (`https://japceibal.github.io/emercado-api/cats_products/${catID}.json`)
    .then (res =>{
        console.log(res);
        if (!res.ok) throw new Error("No encontrado");
        return res.json();
    })
    .then (data =>{
        console.log(data);
        div.innerHTML+= `<h1>${data.catName}</h1>`
        let i=0;
        for (i=0;i<data.products.length;i++){
            div.innerHTML+=`<p id="nombreProd">${data.products[i].name}</p>
                            <p id="descProd">${data.products[i].description}</p>
                            <p id="precioProd">${data.products[i].currency + ' '+data.products[i].cost}</p>
                            <p id="cantDisp">Cantidad de articulos disponibles: ${data.products[i].soldCount}</p>
                          <img src="${data.products[i].image}" alt="Imagen del producto" id="imgProd">`
        }
    })