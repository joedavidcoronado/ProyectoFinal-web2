const db = require("../models/");

/**
 * Desbloquea un logro si el usuario no lo tiene ya.
 * Retorna el logro desbloqueado o null si ya existía.
 */
async function desbloquearLogro(usuarioId, clave) {
    const logro = await db.logro.findOne({ where: { clave } });
    if (!logro) return null;

    const yaDesbloqueado = await db.usuarioLogro.findOne({
        where: { usuarioId, logroId: logro.id }
    });
    if (yaDesbloqueado) return null;

    await db.usuarioLogro.create({ usuarioId, logroId: logro.id });
    return logro;
}

/**
 * Evalúa y otorga logros relacionados a equipos.
 * Llamar después de crear un equipo.
 */
async function evaluarLogrosEquipo(usuarioId) {
    const desbloqueados = [];

    const totalEquipos = await db.equipo.count({ where: { usuarioId } });

    if (totalEquipos >= 1) {
        const logro = await desbloquearLogro(usuarioId, "first_team");
        if (logro) desbloqueados.push(logro);
    }

    if (totalEquipos > 1) {
        const logro = await desbloquearLogro(usuarioId, "multi_team");
        if (logro) desbloqueados.push(logro);
    }

    if (totalEquipos >= 3) {
        const logro = await desbloquearLogro(usuarioId, "team_builder_3");
        if (logro) desbloqueados.push(logro);
    }

    return desbloqueados;
}

/**
 * Evalúa y otorga logros relacionados a pokémon en equipo.
 * Llamar después de agregar o editar un pokémon.
 */
async function evaluarLogrosPokemon(usuarioId, equipoId, accion = "agregar") {
    const desbloqueados = [];

    if (accion === "agregar") {
        // Total de pokémon del usuario en todos sus equipos
        const equipos = await db.equipo.findAll({
            where: { usuarioId },
            attributes: ["id"]
        });
        const equipoIds = equipos.map(e => e.id);

        const totalPokemon = await db.pokemon_equipo.count({
            where: { equipoId: equipoIds }
        });

        if (totalPokemon >= 1) {
            const logro = await desbloquearLogro(usuarioId, "first_pokemon");
            if (logro) desbloqueados.push(logro);
        }

        if (totalPokemon >= 10) {
            const logro = await desbloquearLogro(usuarioId, "collector_10");
            if (logro) desbloqueados.push(logro);
        }

        // Verificar si el equipo actual está completo (6 pokémon)
        const pokemonEnEquipo = await db.pokemon_equipo.count({ where: { equipoId } });
        if (pokemonEnEquipo >= 6) {
            const logro = await desbloquearLogro(usuarioId, "team_complete");
            if (logro) desbloqueados.push(logro);
        }
    }

    if (accion === "editar") {
        const logro = await desbloquearLogro(usuarioId, "pokemon_edited");
        if (logro) desbloqueados.push(logro);
    }

    return desbloqueados;
}

/**
 * Retorna el XP total del usuario sumando los logros desbloqueados.
 */
async function getXpTotal(usuarioId) {
    const logrosDesbloqueados = await db.usuarioLogro.findAll({
        where: { usuarioId },
        include: [{ model: db.logro, as: "logro", attributes: ["xp"] }]
    });

    return logrosDesbloqueados.reduce((total, ul) => total + ul.logro.xp, 0);
}

/**
 * Retorna todos los logros del usuario con estado (desbloqueado o no).
 */
async function getPerfilGamificacion(usuarioId) {
    const todosLosLogros = await db.logro.findAll();
    const desbloqueados = await db.usuarioLogro.findAll({
        where: { usuarioId },
        attributes: ["logroId", "desbloqueadoEn"]
    });

    const desbloqueadosMap = new Map(
        desbloqueados.map(ul => [ul.logroId, ul.desbloqueadoEn])
    );

    const xpTotal = todosLosLogros.reduce((total, logro) => {
        return desbloqueadosMap.has(logro.id) ? total + logro.xp : total;
    }, 0);

    return {
        xpTotal,
        logros: todosLosLogros.map(logro => ({
            clave:          logro.clave,
            nombre:         logro.nombre,
            descripcion:    logro.descripcion,
            xp:             logro.xp,
            desbloqueado:   desbloqueadosMap.has(logro.id),
            desbloqueadoEn: desbloqueadosMap.get(logro.id) ?? null
        }))
    };
}

async function getRanking() {
    const usuarios = await db.usuario.findAll({
        attributes: ["id", "nombre"]
    });

    const ranking = await Promise.all(
        usuarios.map(async (usuario) => ({
            usuarioId: usuario.id,
            nombre: usuario.nombre,
            xpTotal: await getXpTotal(usuario.id)
        }))
    );

    return ranking
        .sort((a, b) => b.xpTotal - a.xpTotal)
        .map((entry, index) => ({ ...entry, posicion: index + 1 }));
}

module.exports = {
    desbloquearLogro,
    evaluarLogrosEquipo,
    evaluarLogrosPokemon,
    getXpTotal,
    getPerfilGamificacion,
    getRanking
};