const express = require("express");
const app = express();
const puerto = 3000;

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.listen(puerto, () => {
  console.log(`Servidor corriendo en http://localhost:${puerto}`);
});
