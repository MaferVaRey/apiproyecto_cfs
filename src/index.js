const parser = require("body-parser");
const express = require('express');
const app = express();
const port = 3000;
const preguntasRoutes = require("./routes/preguntas.js");
const categoriaRoutes = require("./routes/categoria.js");
const usuarioRoute = require("./routes/usuarioRoute");
const mongoose = require("mongoose");

require('dotenv').config();

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(express.json());
app.use("/api", preguntasRoutes);
app.use("/api", usuarioRoute);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conexión exitosa"))
    .catch((error) => console.log(error));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});

// Manejo de rutas no encontradas
app.all('*', (req, res) =>
  res.status(404).json({ status: 'fail', message: `Ruta ${req.originalUrl} no existe.` })
);

module.exports = app;