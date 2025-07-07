const db = require("../models/");

exports.getEquipoList = async (req, res) => {
    const correo = req.params.correo;
    if (correo == null || correo == undefined || correo == '' || !correo) {
        return res.status(400).send({ message: 'El correo del usuario es requerido' });
    }
    const usuario = await db.usuario.findOne({
        where: {
            correo: correo,
        },
    });
    if (!usuario) {
        return res.status(404).send({ message: 'Usuario no encontrado' });
    }
    try {
        const equipos = await db.equipo.findAll({
            where: { usuarioId: usuario.id },
            include: [
            { model: db.pokemon_equipo, as: 'pokemonesequipo' },
        ]
        });
        res.send(equipos);
    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener los equipos' });
    }
};

exports.createEquipo = async (req, res) => {
    const { nombre, correo } = req.body;
    if (!nombre || !correo) {
        return res.status(400).send({ message: "El nombre y el correo son requeridos" });
    }
    const existingEquipo = await db.equipo.findOne({
        where: {
            nombre: nombre,
        },
    });
    if (existingEquipo) {
        return res.status(400).send({ message: "El equipo ya existe" });
    }
    const usuario = await db.usuario.findOne({
        where: {
            correo: correo,
        },
    });
    try {
        const equipo = await db.equipo.create({
            nombre: nombre,
            usuarioId: usuario.id,
        });
        res.send({
            nombre: equipo.nombre,
            usuarioId: equipo.usuarioId,
        });
    } catch (error) {
        console.error("Error al crear equipo:", error);
        return res.status(500).send({ message: "Error al crear equipo" });
    }
}

exports.deleteEquipo = async (req, res) => {
    const { equipoId } = req.params;
    if (!equipoId) {
        return res.status(400).send({ message: "El ID del equipo es requerido" });
    }
    try {
        const equipo = await db.equipo.destroy({
            where: { id: equipoId },
        });
        if (equipo === 0) {
            return res.status(404).send({ message: "Equipo no encontrado" });
        }
        res.send({ message: "Equipo eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar equipo:", error);
        return res.status(500).send({ message: "Error al eliminar equipo" });
    }
}
exports.getEquipoDetalle = async (req, res) => {
    const { equipoId } = req.params;
    if (!equipoId) {
        return res.status(400).send({ message: "El ID del equipo es requerido" });
    }

    try {
        const equipo = await db.equipo.findOne({
            where: { id: equipoId },
            include: [
                {
                    model: db.pokemon_equipo,
                    as: 'pokemonesequipo',
                    include: [
                        { model: db.habilidad, as: 'habilidadesRel' },
                        { model: db.movimiento, as: 'movimientosRel' },
                        { model: db.item, as: 'item' },
                        { model: db.naturaleza, as: 'naturaleza' },
                        { model: db.tipo, as: 'tipo' },
                        { model: db.pokemon, as: 'base' },
                    ]
                }
            ]
        });

        if (!equipo) {
            return res.status(404).send({ message: "Equipo no encontrado" });
        }

        if (!equipo.pokemonesequipo || equipo.pokemonesequipo.length === 0) {
            return res.status(404).send({ message: "Pokémon no encontrados" });
        }

        res.send(equipo);
    } catch (error) {
        console.error("Error al obtener detalle del equipo:", error);
        return res.status(500).send({ message: "Error al obtener detalle del equipo" });
    }
};

exports.updateEquipo = async (req, res) => {
    const { equipo_id } = req.params;
    const { nombre } = req.body;
    const usuario = res.locals.usuario;

    if (!nombre || !equipo_id) {
        return res.status(400).send({ message: "Faltan datos requeridos" });
    }

    try {
        const equipo = await db.equipo.findOne({
            where: {
                id: equipo_id,
                usuarioId: usuario.id
            }
        });

        if (!equipo) {
            return res.status(404).send({ message: "Equipo no encontrado o no autorizado" });
        }

        equipo.nombre = nombre;
        await equipo.save();

        return res.send({ message: "Equipo actualizado correctamente", equipo });
    } catch (error) {
        console.error("Error al actualizar equipo:", error);
        return res.status(500).send({ message: "Error al actualizar el equipo" });
    }
};
