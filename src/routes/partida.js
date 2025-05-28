const express = require("express");
const router = express.Router();
const  Partida  = require("../models/partida");
const  Pregunta  = require("../models/preguntas");
const  Categoria  = require("../models/categoria");


// Crear una nueva partida
router.post("/partidas", async (req, res) => {
    const { idUsuario } = req.body;
    console.log("📥 Recibido POST /partidas con body:", req.body);
    console.log("ID de usuario recibido:", idUsuario);

    try {
        const nuevaPartida = new Partida({
            idUsuario,
            fechaInicio: new Date(),
            tiempoRestante: 60,
            puntajeFinal: 0,
            preguntasRespondidas: []
        });

        console.log("🛠 Guardando partida...");
        const partidaGuardada = await nuevaPartida.save();
        console.log("✅ Partida guardada:", partidaGuardada);

        res.json(partidaGuardada);
    } catch (error) {
        console.error("❌ Error al guardar partida:", error);
        res.status(500).json({ message: error.message });
    }
});
// Girar ruleta y seleccion de categoria
router.get("/partidas/:idPartida/ruleta/categoria", async (req, res) => {
  try {
    const categorias = await Categoria.find();
    if (categorias.length === 0) {
      return res.status(404).json({ message: "No hay categorías disponibles." });
    }

    const categoriaSeleccionada = categorias[Math.floor(Math.random() * categorias.length)];

    // (Opcional) podrías guardar la categoría seleccionada en la partida si quieres
    // await Partida.findByIdAndUpdate(req.params.idPartida, { categoriaActual: categoriaSeleccionada._id });

    res.json({ categoriaSeleccionada });
  } catch (error) {
    console.error("❌ Error al seleccionar categoría:", error);
    res.status(500).json({ message: error.message });
  }
});
// GET /preguntas/aleatoria/:idCategoria
router.get("/preguntas/aleatoria/:idCategoria", async (req, res) => {
  try {
    const { idCategoria } = req.params;
    const preguntas = await Pregunta.find({ categoria: idCategoria });

    if (preguntas.length === 0) {
      return res.status(404).json({ message: "No hay preguntas para esta categoría." });
    }

    const preguntaSeleccionada = preguntas[Math.floor(Math.random() * preguntas.length)];
    res.json({ preguntaSeleccionada });
  } catch (error) {
    console.error("❌ Error al seleccionar pregunta:", error);
    res.status(500).json({ message: error.message });
  }
});
// Obtener historial de partidas de un usuario
router.get("/usuarios/:idUsuario/partidas", async (req, res) => {
    const { idUsuario } = req.params;

    try {
        const partidas = await Partida.find({ idUsuario });
        res.json(partidas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Obtener una partida por su ID
router.get("/partidas/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const partida = await Partida.findById(id);
        if (!partida) return res.status(404).json({ message: "Partida no encontrada" });

        res.json(partida);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Responder una pregunta
router.post("/partidas/:idPartida/responder", async (req, res) => {
    const { idPartida } = req.params;
    const { idPregunta, respuestaSeleccionada } = req.body;

    try {
        const partida = await Partida.findById(idPartida);
        if (!partida) return res.status(404).json({ message: "Partida no encontrada" });

        const preguntaYaRespondida = partida.preguntasRespondidas.some(
            (p) => p.idPregunta.toString() === idPregunta
        );
        if (preguntaYaRespondida) {
            return res.status(400).json({ message: "Pregunta ya fue respondida en esta partida" });
        }

        const pregunta = await Pregunta.findById(idPregunta);
        if (!pregunta) return res.status(404).json({ message: "Pregunta no encontrada" });

        const esCorrecta = pregunta.opciones.some(
            (op) => op.opcion === respuestaSeleccionada && op.correcta
        );

        if (esCorrecta) {
            partida.puntajeFinal += 1;
        } else {
            partida.tiempoRestante = Math.max(partida.tiempoRestante - 5, 0);
        }

        partida.preguntasRespondidas.push({
            idPregunta,
            respuestaUsuario: respuestaSeleccionada,
            esCorrecta,
        });

        await partida.save();

        res.json({
            correcta: esCorrecta,
            puntajeActual: partida.puntajeFinal,
            tiempoRestante: partida.tiempoRestante,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Mostrar resumen de la partida
router.get("/partidas/:idPartida/resumen", async (req, res) => {
    const { idPartida } = req.params;

    try {
        const partida = await Partida.findById(idPartida).populate("preguntasRespondidas.idPregunta");
        if (!partida) return res.status(404).json({ message: "Partida no encontrada" });

        const respuestasIncorrectas = partida.preguntasRespondidas
            .filter((p) => !p.esCorrecta)
            .map((p) => ({
                pregunta: p.idPregunta.pregunta,
                respuestaCorrecta: p.idPregunta.opciones.find(op => op.correcta).opcion,
                respuestaUsuario: p.respuestaUsuario,
            }));

        res.json({
            puntajeFinal: partida.puntajeFinal,
            tiempoRestante: partida.tiempoRestante,
            totalPreguntas: partida.preguntasRespondidas.length,
            respuestasIncorrectas,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Actualizar una partida
router.put("/partidas/:id", async (req, res) => {
    const { id } = req.params;
    const { fechaFin, puntajeFinal } = req.body;

    try {
        const partidaActualizada = await Partida.findByIdAndUpdate(
            id,
            { fechaFin, puntajeFinal },
            { new: true }
        );

        if (!partidaActualizada) {
            return res.status(404).json({ message: "Partida no encontrada" });
        }

        res.json(partidaActualizada);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Eliminar una partida
router.delete("/partidas/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const partidaEliminada = await Partida.findByIdAndDelete(id);
        if (!partidaEliminada) {
            return res.status(404).json({ message: "Partida no encontrada" });
        }

        res.json({ message: "Partida eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;