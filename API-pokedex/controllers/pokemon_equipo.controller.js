const { where } = require("sequelize");
const db = require("../models/");
const gamificacion = require("../services/gamificacion.service");

exports.getPokemonEquipoList = async (req, res) => {
    const usuario = req.params.usuario;
    if (usuario == null || usuario == undefined || usuario == '' || !usuario) {
        return res.status(400).send({ message: 'El ID del usuario es requerido' });
    }
    try {
        const pokemonesEquipo = await db.pokemon_equipo.findAll({
            where: { usuarioId: usuario.id },
        });
        res.send(pokemonesEquipo);
    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener los pokemones' });
    }
};


exports.postPokemonEquipo = async (req, res) => {
    const {
        apodo, ev_hp, ev_attack, ev_defense, ev_sp_atk, ev_sp_def, ev_speed,
        iv_hp, iv_attack, iv_defense, iv_sp_atk, iv_sp_def,
        iv_speed, itemId, tipoId, naturalezaId, pokemonId, equipoId,
        movimientos, habilidades
    } = req.body;

    const camposRequeridos = {
        apodo, ev_hp, ev_attack, ev_defense, ev_sp_atk, ev_sp_def, ev_speed,
        iv_hp, iv_attack, iv_defense, iv_sp_atk, iv_sp_def,
        iv_speed, itemId, tipoId, naturalezaId, pokemonId, equipoId
    };

    for (const [campo, valor] of Object.entries(camposRequeridos)) {
        if (valor === undefined || valor === null) {
            return res.status(400).send({ message: `El campo '${campo}' es requerido` });
        }
    }

    if (!Array.isArray(movimientos) || movimientos.length < 1 || movimientos.length > 4) {
        return res.status(400).send({ message: 'Debe enviar entre 1 y 4 movimientos' });
    }

    if (!Array.isArray(habilidades) || habilidades.length < 1 || habilidades.length > 4) {
        return res.status(400).send({ message: 'Debe enviar entre 1 y 4 habilidades' });
    }

    try {
        const nuevoPokemonEquipo = await db.pokemon_equipo.create({
            apodo,
            ev_hp, ev_attack, ev_defense, ev_sp_atk, ev_sp_def, ev_speed,
            iv_hp, iv_attack, iv_defense, iv_sp_atk, iv_sp_def, iv_speed,
            itemId, tipoId, naturalezaId, pokemonId, equipoId
        });

        await nuevoPokemonEquipo.setMovimientosRel(movimientos);
        await nuevoPokemonEquipo.setHabilidadesRel(habilidades);

        // Obtener usuarioId desde el equipo
        const equipo = await db.equipo.findByPk(equipoId, { attributes: ["usuarioId"] });
        const logrosDesbloqueados = await gamificacion.evaluarLogrosPokemon(
            equipo.usuarioId, equipoId, "agregar"
        );

        const pokemonEquipoConRelaciones = await db.pokemon_equipo.findOne({
            where: { id: nuevoPokemonEquipo.id },
            include: [
                { model: db.movimiento, as: 'movimientosRel' },
                { model: db.habilidad, as: 'habilidadesRel' },
                { model: db.item, as: 'item' },
                { model: db.naturaleza, as: 'naturaleza' },
                { model: db.tipo, as: 'tipo' },
                { model: db.pokemon, as: 'base' }
            ]
        });

        res.status(201).json({ pokemon: pokemonEquipoConRelaciones, logrosDesbloqueados });
    } catch (error) {
        console.error("Error al crear el pokemon_equipo:", error);
        res.status(500).send({ message: 'Error al crear el pokemon_equipo' });
    }
};


exports.deletePokemon_equipo = async (req, res) => {
    const { pokemon_equipoId, equipoId } = req.params;

    if (!pokemon_equipoId) {
        return res.status(400).send({ message: "Favor enviar el pokemon_equipoId" });
    }

    if (!equipoId) {
        return res.status(400).send({ message: "Favor enviar el equipoId" });
    }

    try {
        const resPokemon_equipo = await db.pokemon_equipo.findByPk(pokemon_equipoId);
        if (!resPokemon_equipo) {
            return res.status(404).send({ message: 'Pokémon no encontrado' });
        }

        if (resPokemon_equipo.equipoId != equipoId) {
            return res.status(401).send({ message: 'Pokémon no pertenece a ese equipo' });
        }

        const equipo = await db.equipo.findByPk(equipoId);
        if (!equipo) {
            return res.status(404).send({ message: 'Equipo no encontrado' });
        }

        if (equipo.usuarioId != res.locals.usuario.id) {
            return res.status(403).send({ message: 'No autorizado para eliminar este Pokémon' });
        }

        await resPokemon_equipo.destroy();

        return res.send({ message: 'Pokémon eliminado exitosamente del equipo' });

    } catch (error) {
        console.error("Error al eliminar Pokémon:", error);
        return res.status(500).send({ message: "Error interno al eliminar el Pokémon" });
    }
};

exports.getPokemonEquipoDetalle = async (req, res) => {
    const { pokemonId, equipoId } = req.params;
    const usuarioId = res.locals.usuario.id;

    if (!pokemonId || !equipoId) {
        return res.status(400).send({ message: "Faltan parámetros" });
    }

    try {
        const pokemonEquipo = await db.pokemon_equipo.findOne({
            where: {
                pokemonId,
                equipoId
            },
            include: [
                { model: db.movimiento, as: 'movimientosRel' },
                { model: db.habilidad, as: 'habilidadesRel' },
                { model: db.item, as: 'item' },
                { model: db.naturaleza, as: 'naturaleza' },
                { model: db.tipo, as: 'tipo' },
                { model: db.pokemon, as: 'base' }
            ]
        });

        if (!pokemonEquipo) {
            return res.status(404).send({ message: 'Pokémon no encontrado en el equipo' });
        }

        res.json(pokemonEquipo);
    } catch (error) {
        console.error("Error al obtener detalle:", error);
        res.status(500).send({ message: 'Error al obtener detalle del Pokémon' });
    }
};


exports.putPokemonEquipo = async (req, res) => {
    const { pokemonId, equipoId } = req.params;
    const usuarioId = res.locals.usuario?.id;

    if (!pokemonId || !equipoId || !usuarioId) {
        return res.status(400).json({ message: "Faltan parámetros requeridos." });
    }

    const {
        apodo, ev_hp, ev_attack, ev_defense, ev_sp_atk, ev_sp_def, ev_speed,
        iv_hp, iv_attack, iv_defense, iv_sp_atk, iv_sp_def, iv_speed,
        itemId, naturalezaId, tipoId, habilidades, movimientos
    } = req.body;

    if (!apodo || !naturalezaId || !itemId || !tipoId) {
        return res.status(400).json({ message: "Faltan campos obligatorios en el cuerpo de la solicitud." });
    }

    if (!Array.isArray(habilidades) || habilidades.length === 0 || habilidades.length > 3) {
        return res.status(400).json({ message: "Debes seleccionar entre 1 y 3 habilidades." });
    }

    if (!Array.isArray(movimientos) || movimientos.length === 0 || movimientos.length > 4) {
        return res.status(400).json({ message: "Debes seleccionar entre 1 y 4 movimientos." });
    }

    const totalEVs = [ev_hp, ev_attack, ev_defense, ev_sp_atk, ev_sp_def, ev_speed]
        .map(Number).reduce((acc, val) => acc + (isNaN(val) ? 0 : val), 0);

    if (totalEVs > 508) {
        return res.status(400).json({ message: "El total de EVs no puede superar 508." });
    }

    try {
        const pokemonEquipo = await db.pokemon_equipo.findOne({
            where: { pokemonId, equipoId },
            include: [{ model: db.equipo, as: "equipo", where: { usuarioId } }]
        });

        if (!pokemonEquipo) {
            return res.status(404).json({ message: "Pokémon no encontrado o no pertenece a tu equipo." });
        }

        await pokemonEquipo.update({
            apodo,
            ev_hp: ev_hp || 0, ev_attack: ev_attack || 0, ev_defense: ev_defense || 0,
            ev_sp_atk: ev_sp_atk || 0, ev_sp_def: ev_sp_def || 0, ev_speed: ev_speed || 0,
            iv_hp: iv_hp || 0, iv_attack: iv_attack || 0, iv_defense: iv_defense || 0,
            iv_sp_atk: iv_sp_atk || 0, iv_sp_def: iv_sp_def || 0, iv_speed: iv_speed || 0,
            itemId, naturalezaId, tipoId
        });

        await pokemonEquipo.setHabilidadesRel(habilidades);
        await pokemonEquipo.setMovimientosRel(movimientos);

        const logrosDesbloqueados = await gamificacion.evaluarLogrosPokemon(
            usuarioId, equipoId, "editar"
        );

        res.status(200).json({ message: "Pokémon actualizado correctamente.", logrosDesbloqueados });
    } catch (error) {
        console.error("Error al actualizar el Pokémon del equipo:", error);
        res.status(500).json({ message: "Error interno al actualizar el Pokémon del equipo." });
    }
};
