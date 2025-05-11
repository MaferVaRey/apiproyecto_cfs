const express = require("express");
const router = express.Router();
const preguntasSchema = require("../models/preguntas");

//Creación de preguntas
router.post("/preguntas", (req, res) => {
    const animal = preguntasSchema(req.body);
    animal.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Consulta de preguntas en general
router.get("/preguntas", (req, res) => {
    preguntasSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});



module.exports = router;