const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const usuarioSchema = new mongoose.Schema({

    nombreUsuario: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true, unique: true, lowercase: true },
    clave: { type: String, required: true },
    rol: { type: String, enum: ['jugador', 'administrador'], default: 'jugador' }, // Define el rol
    fechaRegistro: { type: Date, default: Date.now }

});

usuarioSchema.methods.encryptClave = async (clave) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(clave, salt);
}

module.exports = mongoose.model('Usuario', usuarioSchema);