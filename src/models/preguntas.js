const mongoose  = require("mongoose");


const opcionSchema = mongoose.Schema({
    opcion: {
        type: String,
        required: true,
    },
    correcta: {
        type: Boolean,
        default: false
    }
});

const preguntaSchema = mongoose.Schema({
    enunciado: {
        type: String,
        required: true
    },

    opciones:{
        type: [opcionSchema],
        validate: [
      {
        validator: function(value) {
          return value.length === 4;
        },
      },
      {
        validator: function(value) {
          const correctas = value.filter(opcion => opcion.correcta);
          return correctas.length === 1;
        },
      }
    ]
  },

    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categorias",
        required: true
    }
})
module.exports = mongoose.model("Preguntas", preguntaSchema);