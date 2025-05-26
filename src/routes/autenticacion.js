const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const userSchema = require("../models/usuarioModel");

//registro de usuario
router.post("/signup", async (req, res) => {

    const { nombreUsuario, nombre, apellido, correo, clave, rol } = req.body;
    
    const user = new userSchema({
        nombreUsuario: nombreUsuario,
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        clave: clave,
        rol: rol
    });

    user.clave = await user.encryptClave(user.clave);
    await user.save(); 
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24,
    });

    res.json({
        auth: true,
        token,
    });
});

//inicio de sesión
router.post("/login", async (req, res) => { 
    const { error } = userSchema.validate(req.body.correo, req.body.clave);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    const user = await userSchema.findOne({ correo: req.body.correo });
    if (!user) return res.status(400).json({ error: "Usuario no encontrado" });
    
    const validPassword = await bcrypt.compare(req.body.clave, user.clave);
    if (!validPassword)
        return res.status(400).json({ error: "Clave no válida" });

    // Generar token igual que en signup
    const token = jwt.sign({ id: user._id }, process.env.SECRET, {
        expiresIn: 60 * 60 * 24,
    });

    res.json({
        auth: true,
        token,  // Token agregado aquí
        message: `¡Bienvenido(a), ${user.nombre} ${user.apellido}!`
    });
});

module.exports = router;
