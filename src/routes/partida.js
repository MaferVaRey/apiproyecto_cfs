const express = require("express");
const router = express.Router();
const partidaSchema = require("../models/partida");

// Crear una nueva partida 
router.post("/partidas", (req, res) => {
    const partida = new partidaSchema({
        idUsuario: req.body.idUsuario,
        fechaInicio: new Date(), 
    });

    partida.save()
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error }));
});

// Obtener historial de partidas de un usuario 
router.get("/usuarios/:idUsuario/partidas", (req, res) => {
    const { idUsuario } = req.params;
    partidaSchema.find({ idUsuario })
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error }));
});
// Obtener una partida por su ID 
router.get("/partidas/:id", (req, res) => {
    const { id } = req.params;
    partidaSchema.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error }));
});

// Actualizar una partida (PUT /partidas/:id)
router.put("/partidas/:id", (req, res) => {
    const { id } = req.params;
    const { fechaFin, puntajeFinal } = req.body;

    partidaSchema.updateOne({ _id: id }, {
        $set: { fechaFin, puntajeFinal }
    })
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error }));
});

// Eliminar una partida (DELETE /partidas/:id)
router.delete("/partidas/:id", (req, res) => {
    const { id } = req.params;
    partidaSchema.findByIdAndDelete(id)
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error }));
});

module.exports = router;