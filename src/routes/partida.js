const express = require("express");
const router = express.Router();
const partidaSchema = require("../models/partida");
const preguntaSchema = requiere("../models/preguntas")

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

// Actualizar una partida 
router.put("/partidas/:id", (req, res) => {
    const { id } = req.params;
    const { fechaFin, puntajeFinal } = req.body;

    partidaSchema.updateOne({ _id: id }, {
        $set: { fechaFin, puntajeFinal }
    })
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json({ message: error }));
});

// Eliminar una partida 
router.delete("/partidas/:id", (req, res) => {
    const { id } = req.params;
    partidaSchema.findByIdAndDelete(id)
        .then((data) => res.json(data))
        .catch((error) => res.status(500).json({ message: error }));
});
// Responder una pregunta
router.post("/partidas/:idPartida/responder", async (req, res) => {
    const { idPartida } = req.params;
    const { idPregunta, respuestaSeleccionada } = req.body;

    try {
        // Buscar la partida
        const partida = await partidaSchema.findById(idPartida);
        if (!partida) return res.status(404).json({ message: "Partida no encontrada" });

        // Validar si la pregunta ya fue respondida
        if (partida.preguntasRespondidas.includes(idPregunta)) {
            return res.status(400).json({ message: "Pregunta ya fue respondida en esta partida" });
        }

        // Buscar la pregunta
        const pregunta = await preguntaSchema.findById(idPregunta);
        if (!pregunta) return res.status(404).json({ message: "Pregunta no encontrada" });

        // Validar respuesta
        let esCorrecta = false;
        if (pregunta.respuestaCorrecta.toUpperCase() === respuestaSeleccionada.toUpperCase()) {
            esCorrecta = true;
            partida.puntajeFinal += 1;
        } else {
            partida.tiempoRestante = Math.max(partida.tiempoRestante - 5, 0);
        }

        // Marcar la pregunta como respondida
        partida.preguntasRespondidas.push(idPregunta);

        // Guardar cambios
        await partida.save();

        res.json({
            correcta: esCorrecta,
            puntajeActual: partida.puntajeFinal,
            tiempoRestante: partida.tiempoRestante
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;