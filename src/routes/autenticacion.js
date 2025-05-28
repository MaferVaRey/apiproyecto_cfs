const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuarioModel");

//registro de usuario
router.post("/signup", async (req, res) => {

    const { nombreUsuario, nombre, apellido, correo, clave, rol } = req.body;

    const user = new Usuario({
        nombreUsuario: nombreUsuario,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        clave: clave,
        rol: rol
    });

    user.clave = await user.encryptClave(user.clave);
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24,
    });

    res.json({
        auth: true,
        token,
    });
});

// inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { correo, clave } = req.body;

    // Validación básica
    if (!correo || !clave) {
      return res.status(400).json({ error: 'Correo y clave son obligatorios' });
    }

    // Busca el usuario por correo
    const user = await Usuario.findOne({ correo });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Compara la contraseña
    const validPassword = await bcrypt.compare(clave, user.clave);
    if (!validPassword) {
      return res.status(401).json({ error: 'Clave no válida' });
    }
    

    // Genera el JWT incluyendo el rol
    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Responde con auth, mensaje y token
    return res.status(200).json({
      auth: true,
      message: `¡Bienvenido(a), ${user.nombre} ${user.apellido}!`,
      token,
  
    });
  } catch (err) {
    console.error('Error en /login:', err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
