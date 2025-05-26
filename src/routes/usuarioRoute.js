const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const verifyToken = require('./validate-token');
const Usuario = require('../models/usuarioModel');

// Crear usuario
router.post("/usuarios", (req, res) => {
  // Se crea un nuevo usuario, asignando la contraseña por defecto
  const usuario = new usuarioSchema({
    ...req.body,
    clave: "Bogota2025*" // Contraseña por defecto
  });

  usuarioSchema
    .save()
    .then((data) => res.json(data))
    .catch((error) => res.json({ message: error }));
});

// Obtener todos los usuarios
router.get('/usuarios', async (req, res, next) => {
  try {
    const users = await Usuario.find().select('-clave');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Obtener usuario por id
router.get('/usuarios/:id', async (req, res, next) => {
  try {
    const user = await Usuario.findById(req.params.id).select('-clave');
    if (!user) return res.status(404).json({ error: 'No encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Actualizar usuario
router.put('/usuarios/:id', async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.clave) data.clave = await bcrypt.hash(data.clave, 10);
    const user = await Usuario.findByIdAndUpdate(req.params.id, data, { new: true }).select('-clave');
    if (!user) return res.status(404).json({ error: 'No encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Eliminar usuario
router.delete('/usuarios/:id', async (req, res, next) => {
  try {
    const user = await Usuario.findByIdAndDelete(req.params.id).select('-clave');
    if (!user) return res.status(404).json({ error: 'No encontrado' });
    res.json({ message: 'Se eliminó usuario correctamente' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;