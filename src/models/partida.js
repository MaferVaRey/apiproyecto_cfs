const mongoose = require("mongoose");

const partidaSchema = new mongoose.Schema({
    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    puntajeFinal: {
        type: Number,
        default: 0
    },
    tiempoRestante: {
        type: Number,
        default: 60 
    },
    preguntasRespondidas: [{
        idPregunta: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pregunta"
        },
        respuestaUsuario: String,
        esCorrecta: Boolean
    }]
});

const Partida = mongoose.model("Partida", partidaSchema);
module.exports = Partida ;