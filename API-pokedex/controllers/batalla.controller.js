// controllers/batalla.controller.js
const batallaService = require("../services/batalla.service");

exports.registrarBatalla = async (req, res) => {
    try {
        const usuarioId = res.locals.usuario.id;
        const { equipoId, resultado, turnosTotales, equipoRivalNombre } = req.body;

        const data = await batallaService.registrarBatalla(
            usuarioId, equipoId, resultado, turnosTotales, equipoRivalNombre
        );

        res.json(data);
    } catch (error) {
        console.error("Error al registrar batalla:", error);
        res.status(500).json({ message: "Error al registrar batalla" });
    }
};