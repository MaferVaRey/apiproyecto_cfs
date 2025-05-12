const mongoose  = require("mongoose");
const partidaSchema = mongoose.Schema({

    idUsuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", // Asegúrate de que coincida con el nombre del modelo de usuario
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
    }
})
module.exports = mongoose.model("Partidas", partidaSchema);