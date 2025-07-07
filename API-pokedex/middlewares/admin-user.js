const db = require("../models/");

exports.adminUser = async (req, res, next) => {
    try {
        const usuario = res.locals.usuario;

        if (!usuario || !usuario.id || !usuario.tipo) {
            return res.status(400).json({ message: "Datos de usuario no disponibles" });
        }

        const usuarioExistente = await db.usuario.findByPk(usuario.id);
        if (!usuarioExistente) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        if (usuario.tipo !== "admin") {
            return res.status(403).json({ message: "Acceso denegado: se requiere perfil admin" });
        }

        next();
    } catch (error) {
        console.error("Error en adminUser:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};
