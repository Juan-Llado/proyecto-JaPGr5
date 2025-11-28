const express = require("express");
const fs = require("fs"); //agrego fs y path para poder leer y armar las rutas para cada categoria de manera dinamica
const path = require("path");
const cors = require("cors"); //lo uso para permitir que el frontend pueda hacer peticiones al servidor aunque estén en orígenes distintos

const app = express();
const puerto = 3000;

const categorias=require('./emercado-api-main/cats/cat.json');
const publish=require('./emercado-api-main/sell/publish.json');
const cart=require('./emercado-api-main/cart/buy.json');
const cats=require('./emercado-api-main/cats/cat.json');


app.use(cors()); 
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});


app.get("/api/categorias", (req, res) => {  //trae el json que contiene las categorias y su descripción
  res.json(categorias);
});

app.get("/api/publish", (req, res) => {  //trae publish.json
  res.json(publish);
});

app.get("/api/cart", (req, res) => {  //trae cart.json
  res.json(cart);
});

app.get("/api/cats", (req, res) => {  //trae cats.json
  res.json(cart);
});


app.get("/api/categorias/:catID", (req, res) => { //traigo los productos que estan en cada categoria
  const catID = req.params.catID;
  const archivoPath = path.join(__dirname, 'emercado-api-main', 'cats_products', `${catID}.json`); //con path.join evito problemas de ruta
  
  try {
    const data = fs.readFileSync(archivoPath, "utf8"); // leo el archivo
    const productos = JSON.parse(data);                // lo convierte a json
    res.json(productos);                               // lo envía al frontend
  } catch (error) {
    res.status(500).json({ error: "Error leyendo JSON" });
  }
});

app.get("/api/infoProducto", (req, res) => {  //trae la información de cada producto
  const dirProducto = path.join(__dirname, 'emercado-api-main', 'products');
  let info = [];

  try {
    const productos = fs.readdirSync(dirProducto); // lista todos los archivos .json de la carpeta

    productos.forEach(file => {
      const data = fs.readFileSync(path.join(dirProducto, file), 'utf8');
      info.push(JSON.parse(data));
    });

    res.json(info); // envío al frontend todos los productos
  } catch (error) {
    res.status(500).json({ error: "Error leyendo los productos" });
  }
});

app.get("/api/comentarios", (req, res) => {  //trae los comentarios
  const dirComentario = path.join(__dirname, 'emercado-api-main', 'products_comments');
  let listaCom = [];

  try {
    const comentarios = fs.readdirSync(dirComentario); // lista todos los archivos .json de la carpeta

    comentarios.forEach(file => {
      const data = fs.readFileSync(path.join(dirComentario, file), 'utf8');
      listaCom.push(JSON.parse(data));
    });

    res.json(listaCom); // envío al frontend todos los comentarios
  } catch (error) {
    res.status(500).json({ error: "Error leyendo los comentarios" });
  }
});


app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
