const parser = require("body-parser");
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const port = 3000;

const preguntasRoutes = require("./routes/preguntas.js");
const categoriaRoutes = require("./routes/categoria.js");
const autenticaionRoute = require("./routes/autenticacion.js");

require('dotenv').config();

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(express.json());

app.use("/api", preguntasRoutes);
app.use("/api", categoriaRoutes);
app.use("/api", autenticaionRoute);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Conexión exitosa"))
  .catch((error) => console.log(error));
//Conexión al puerto
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  
});

module.exports = app;
