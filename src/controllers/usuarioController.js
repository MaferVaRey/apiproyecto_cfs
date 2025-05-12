const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel.js');

const signToken = (usuario) => {
    return jwt.sign(
        { id: usuario._id, nombreUsuario: usuario.nombreUsuario, rol: usuario.rol },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// Registro de usuario
exports.signup = async (req, res) => {
    try {
        const { nombreUsuario, nombre, apellido, correo, contrasena, rol } = req.body;
        // Crear usuario
        const nuevoUsuario = await Usuario.create({
            nombreUsuario, nombre, apellido, correo, contrasena, rol
        });
        const token = signToken(nuevoUsuario);

        res.status(201).json({
            status: 'success',
            token,
            data: { usuario: nuevoUsuario }
        });
    } catch (error) {
        res.status(400).json({ status: 'fail', message: error.message });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    try {
        const { nombreUsuario, contrasena } = req.body;
        if (!nombreUsuario || !contrasena) {
            return res.status(400).json({
                status: 'fail',
                message: 'Debes proporcionar nombre de usuario y contraseña.'
            });
        }

        const usuario = await Usuario.findOne({ nombreUsuario });
        if (!usuario || !(await usuario.compararPassword(contrasena))) {
            return res.status(401).json({
                status: 'fail',
                message: 'Usuario o contraseña incorrectos.'
            });
        }

        const token = signToken(usuario);
        res.status(200).json({
            status: 'success',
            token,
            data: { usuario }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Middleware: proteger rutas con JWT
exports.protect = async (req, res, next) => {
    let token;

    // 1. Validar formato del token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        const [bearer, receivedToken] = req.headers.authorization.split(' ');
        if (bearer !== 'Bearer' || !receivedToken) {
            return res.status(401).json({ 
                status: 'fail', 
                message: 'Formato de token inválido' 
            });
        }
        token = receivedToken;
    }

    if (!token) {
        return res.status(401).json({ 
            status: 'fail', 
            message: 'No autenticado. Por favor inicia sesión' 
        });
    }

    try {
        // 2. Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded?.id) {
            return res.status(401).json({ 
                status: 'fail', 
                message: 'Token inválido' 
            });
        }

        // 3. Verificar existencia del usuario
        const usuario = await Usuario.findById(decoded.id);
        if (!usuario) {
            return res.status(401).json({ 
                status: 'fail', 
                message: 'El usuario asociado al token ya no existe' 
            });
        }

        req.usuario = usuario;
        next();

    } catch (err) {
        // 4. Manejar JWT expirado explícitamente
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                status: 'fail', 
                message: 'Token expirado' 
            });
        }
        res.status(401).json({ 
            status: 'fail', 
            message: 'Token inválido' 
        });
    }
};

// Middleware: restringir por rol (e.g. 'administrador')
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({ status: 'fail', message: 'No tienes permiso.' });
        }
        next();
    };
};