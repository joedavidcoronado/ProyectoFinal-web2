const gamificacion = require("../services/gamificacion.service");

exports.getPerfilGamificacion = async (req, res) => {
    try {
        const usuarioId = res.locals.usuario.id;
        const perfil = await gamificacion.getPerfilGamificacion(usuarioId);
        res.json(perfil);
    } catch (error) {
        console.error("Error al obtener perfil de gamificación:", error);
        res.status(500).json({ message: "Error al obtener perfil de gamificación" });
    }
};

exports.getXpTotal = async (req, res) => {
    try {
        const usuarioId = res.locals.usuario.id;
        const xp = await gamificacion.getXpTotal(usuarioId);
        res.json({ xp });
    } catch (error) {
        console.error("Error al obtener XP:", error);
        res.status(500).json({ message: "Error al obtener XP" });
    }
};

exports.getRanking = async (req, res) => {
    try {
        const ranking = await gamificacion.getRanking();
        res.json(ranking);
    } catch (error) {
        console.error("Error al obtener ranking:", error);
        res.status(500).json({ message: "Error al obtener ranking" });
    }
};