// services/batalla.service.js
const db = require("../models/");
console.log("Modelos disponibles en db:", Object.keys(db));
const { desbloquearLogro } = require("./gamificacion.service");

async function registrarBatalla(usuarioId, equipoId, resultado, turnosTotales, equipoRivalNombre) {
    const desbloqueados = [];

    await db.batalla.create({ usuarioId, equipoId, resultado, turnosTotales, equipoRivalNombre });

    const totalBatallas = await db.batalla.count({ where: { usuarioId } });
    const totalVictorias = await db.batalla.count({ where: { usuarioId, resultado: "victoria" } });

    // Logro: primera batalla
    if (totalBatallas >= 1) {
        const logro = await desbloquearLogro(usuarioId, "first_battle");
        if (logro) desbloqueados.push(logro);
    }

    // Logro: primera victoria
    if (resultado === "victoria") {
        const logro = await desbloquearLogro(usuarioId, "first_win");
        if (logro) desbloqueados.push(logro);
    }

    // Logro: 10 batallas
    if (totalBatallas >= 10) {
        const logro = await desbloquearLogro(usuarioId, "veteran_10");
        if (logro) desbloqueados.push(logro);
    }

    // Logro: 3 victorias seguidas
    if (totalVictorias >= 3) {
        const ultimasTres = await db.batalla.findAll({
            where: { usuarioId },
            order: [["createdAt", "DESC"]],
            limit: 3,
        });
        const racha = ultimasTres.every(b => b.resultado === "victoria");
        if (racha) {
            const logro = await desbloquearLogro(usuarioId, "win_streak_3");
            if (logro) desbloqueados.push(logro);
        }
    }

    return { desbloqueados };
}

module.exports = { registrarBatalla };