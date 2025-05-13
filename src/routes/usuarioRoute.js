const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const verifyToken = require('./validate-token');
const Usuario = require('../models/usuarioModel');

// Crear usuario
router.post('/usuarios', async (req, res, next) => {
  try {
    const { nombreUsuario, nombre, apellido, correo, clave, rol } = req.body;
    // Verificar usuario o correo existente
    const exist = await Usuario.findOne({ $or: [{ nombreUsuario }, { correo }] });
    if (exist) return res.status(409).json({ error: 'Usuario o correo ya existe' });

    // Encriptar y guardar
    const hashed = await bcrypt.hash(clave, 10);
    const user = await new Usuario({ nombreUsuario, nombre, apellido, correo, clave: hashed, rol }).save();
    res.status(201).json({ ...user.toObject(), clave: undefined });
  } catch (err) {
    next(err);
  }
});

// Obtener todos los usuarios
router.get('/usuarios', verifyToken, async (req, res, next) => {
  try {
    const users = await Usuario.find().select('-clave');
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Obtener usuario por id
router.get('/usuarios/:id', verifyToken, async (req, res, next) => {
  try {
    const user = await Usuario.findById(req.params.id).select('-clave');
    if (!user) return res.status(404).json({ error: 'No encontrado' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Actualizar usuario
router.put('/usuarios/:id', verifyToken, async (req, res, next) => {
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
router.delete('/usuarios/:id', verifyToken, async (req, res, next) => {
  try {
    const user = await Usuario.findByIdAndDelete(req.params.id).select('-clave');
    if (!user) return res.status(404).json({ error: 'No encontrado' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;