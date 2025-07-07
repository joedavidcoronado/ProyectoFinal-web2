const { where } = require("sequelize");
const db = require("../models/");

exports.getUsuarioList = async (req, res) => {
    try {
        const usuarios = await db.usuario.findAll();
        res.send(usuarios);
    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener los usuarios' });
    }
};

exports.getUsuarioById = async (req, res) => {
    const { id } = req.params;
    const usuario = await db.usuario.findByPk(id);
    if (!usuario) {
        return res.status(404).send({ message: 'usuario no encontrado' });
    }
    res.send(usuario);
}

exports.getUsuarioByEmail = async (req, res) => {
    const { correo } = req.params;
    try {
        const usuario = await db.usuario.findOne({ where: { correo } });
        if (!usuario) {
            return res.status(404).send({ message: 'Usuario no encontrado' });
        }

        const isAdmin = usuario.tipo === 'admin';
        res.send({ isAdmin });
    } catch (error) {
        res.status(500).send({ message: 'Error al buscar usuario' });
    }
};


exports.cambiarRolUsuario = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(404).json({ message: "Ocurrió un error" });
    }

    try {
        const usuario = await db.usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        usuario.tipo = usuario.tipo === "admin" ? "normal" : "admin";
        await usuario.save();

        res.json({ message: `Rol actualizado a ${usuario.tipo}` });
    } catch (error) {
        console.error("Error al cambiar el rol:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

