const parser = require("body-parser");
const express = require('express');
const app = express();
const port = 3000;
const preguntasRoutes = require("./routes/preguntas.js");
//const authRoutes = require("./routes/authentication")
const mongoose = require("mongoose");
require('dotenv').config();
app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());
app.use(express.json());
app.use("/api", preguntasRoutes);

mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conexión exitosa"))
    .catch((error) => console.log(error));
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});