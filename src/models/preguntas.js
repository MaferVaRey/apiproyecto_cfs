const mongoose  = require("mongoose");
const preguntaSchema = mongoose.Schema({

    pregunta: {
        type: String,
        required: true
    },

    solucionA: {
        type: String,
        required: true
    },

    solucionB: {
        type: String,
        required: true
    },

    solucionC: {
        type: String,
        required: true
    },

    solucionD: {
        type: String,
        required: true
    },

    respuestaCorrecta: {
        type: String,
        required: true
    },

    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categorias",
        required: true
    }
})
module.exports = mongoose.model("Preguntas", preguntaSchema);