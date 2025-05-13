const mongoose  = require("mongoose");
const partidaSchema = mongoose.Schema({

    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    },
    fechaInicio: {
        type: Date,
        default: Date.now
    },
    fechaFin: {
        type: Date
    },
    puntajeFinal: {
        type: Number,
        default: 0
    },
    preguntasRespondidas: [{
        idPregunta: {type: mongoose.Schema.Types.ObjectId,
        ref: "Preguntas"
    },
    respuestaUsuario: String,
    esCorrecta: Boolean
}]
})
module.exports = mongoose.model("Partidas", partidaSchema);