const express = require("express");
const router = express.Router();
const { Partida } = require("../models/partida");
const {Pregunta} = require("../models/preguntas");
const {Categoria} = require("../models/categoria");

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

// Girar la ruleta y seleccionar una categoría
router.get("/partidas/:idPartida/ruleta", async (req, res) => {
    const { idPartida } = req.params;

    try {
        const categorias = await Categoria.find();
        if (categorias.length === 0) return res.status(404).json({ message: "No hay categorías disponibles." });

        // Seleccionar categoría aleatoria
        const categoriaSeleccionada = categorias[Math.floor(Math.random() * categorias.length)];

        res.json({ categoriaSeleccionada });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Seleccionar pregunta aleatoria de una categoría
router.get("/partidas/:idPartida/categoria/:idCategoria/pregunta", async (req, res) => {
    const { idCategoria } = req.params;

    try {
        const preguntas = await Pregunta.find({ categoria: idCategoria });
        if (preguntas.length === 0) return res.status(404).json({ message: "No hay preguntas en esta categoría." });

        // Seleccionar pregunta aleatoria
        const preguntaSeleccionada = preguntas[Math.floor(Math.random() * preguntas.length)];

        res.json({ preguntaSeleccionada });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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
          const partida = await Partida.findById(idPartida);
          if (!partida) return res.status(404).json({ message: "Partida no encontrada" });
  
          // Validar si la pregunta ya fue respondida
          const preguntaYaRespondida = partida.preguntasRespondidas.some(p => p.idPregunta.toString() === idPregunta);
          if (preguntaYaRespondida) {
              return res.status(400).json({ message: "Pregunta ya fue respondida en esta partida" });
          }
  
          // Buscar la pregunta
          const pregunta = await Pregunta.findById(idPregunta);
          if (!pregunta) return res.status(404).json({ message: "Pregunta no encontrada" });
  
          // Verificar la respuesta correcta
          const opcionCorrecta = pregunta.opciones.find(op => op.correcta);
          const esCorrecta = pregunta.opciones.some(op => op.opcion === respuestaSeleccionada && op.correcta);
  
          // Ajustar puntaje y tiempo restante
          if (esCorrecta) {
              partida.puntajeFinal += 1;
          } else {
              partida.tiempoRestante = Math.max(partida.tiempoRestante - 5, 0);
          }
  
          // Registrar la respuesta
          partida.preguntasRespondidas.push({
              idPregunta,
              respuestaUsuario: respuestaSeleccionada,
              esCorrecta
          });
  
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
    // Mostrar resumen
    router.get("/partidas/:idPartida/resumen", async (req, res) => {
        const { idPartida } = req.params;
    
        try {
            const partida = await partidaSchema.findById(idPartida).populate("preguntasRespondidas.idPregunta");
            if (!partida) return res.status(404).json({ message: "Partida no encontrada" });
    
            // Filtrar preguntas mal respondidas
            const respuestasIncorrectas = partida.preguntasRespondidas
                .filter(p => !p.esCorrecta)
                .map(p => ({
                    pregunta: p.idPregunta.pregunta,
                    respuestaCorrecta: p.idPregunta.respuestaCorrecta,
                    respuestaUsuario: p.respuestaUsuario
                }));
    
            res.json({
                puntajeFinal: partida.puntajeFinal,
                tiempoRestante: partida.tiempoRestante,
                totalPreguntas: partida.preguntasRespondidas.length,
                respuestasIncorrectas
            });
    
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });
    

module.exports = router;