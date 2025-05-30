const express = require("express");
const router = express.Router();
const preguntasSchema = require("../models/preguntas");

//Creación de preguntas
router.post("/preguntas", (req, res) => {
    const pregunta = preguntasSchema(req.body);
    pregunta.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Consultar preguntas por caetgoría
router.get('/preguntas/categoria-id/:id', async (req, res) => {
    const categoriaId = req.params.id;
    preguntasSchema.find({ categoria: categoriaId })
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});


//Consulta de preguntas en general
router.get("/preguntas", (req, res) => {
    preguntasSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Consulta de preguntas por su id
router.get("/preguntas/:id", (req, res) => {
    const { id } = req.params;
    preguntasSchema.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Modificar una pregunta por su id
router.put("/preguntas/:id", (req, res) => {
    const { id } = req.params;
    const { enunciado, opciones, categoria  } = req.body;
    preguntasSchema.updateOne({ _id: id }, {
            $set: { enunciado, opciones, categoria }})
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

//Eliminar una pregunta por su id
router.delete("/preguntas/:id", (req, res) => {
    const { id } = req.params;
    preguntasSchema.findByIdAndDelete(id)
        .then((data) => {res.json(data);})
        .catch((error) => {res.json({ message: error });});
});

module.exports = router;