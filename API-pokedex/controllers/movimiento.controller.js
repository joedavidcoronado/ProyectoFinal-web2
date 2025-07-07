
const db = require("../models/");

exports.getAllMovimientoList = async (req, res) => {
    try {
        const movimientos = await db.movimiento.findAll();
        return res.send(movimientos);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al obtener los movimientos' });
    }
};

exports.getMovimientoList = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ message: 'ID de Pokémon es requerido' });
    }

    try {
        const pokemon = await db.pokemon.findByPk(id);
        if (!pokemon) {
        return res.status(404).send({ message: 'Pokémon no encontrado' });
        }

        if (!pokemon.tipoId) {
        return res.status(400).send({ message: 'El Pokémon no tiene tipo asignado' });
        }

        const movimientos = await db.movimiento.findAll({
            where: { tipoId: pokemon.tipoId }
        });
        return res.send(movimientos);
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al obtener los movimientos' });
    }
};

exports.postMovimiento = async (req, res) => {
    const { nombre, tipoId, power, categoria } = req.body;

    if (!nombre || !tipoId || !categoria) {
        return res.status(400).send({ message: "Faltan datos requeridos" });
    }

    try {
        const nuevoMovimiento = await db.movimiento.create({
            nombre,
            tipoId,
            power: power || null,
            categoria,
        });

        res.status(201).send(nuevoMovimiento);
    } catch (error) {
        console.error("Error al crear movimiento:", error);
        res.status(500).send({ message: "Error al crear el movimiento" });
    }
};

exports.updateMovimiento = async (req, res) => {
    const { id } = req.params;
    const { nombre, tipoId, power, categoria } = req.body;

    try {
        const movimiento = await db.movimiento.findByPk(id);

        if (!movimiento) {
            return res.status(404).send({ message: "Movimiento no encontrado" });
        }

        movimiento.nombre = nombre || movimiento.nombre;
        movimiento.tipoId = tipoId || movimiento.tipoId;
        movimiento.power = power ?? movimiento.power;
        movimiento.categoria = categoria || movimiento.categoria;

        await movimiento.save();

        res.send({ message: "Movimiento actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar movimiento:", error);
        res.status(500).send({ message: "Error al actualizar el movimiento" });
    }
};

exports.deleteMovimiento = async (req, res) => {
    const { id } = req.params;

    try {
        const movimiento = await db.movimiento.findByPk(id);

        if (!movimiento) {
            return res.status(404).send({ message: "Movimiento no encontrado" });
        }

        await movimiento.destroy();
        res.send({ message: "Movimiento eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar movimiento:", error);
        res.status(500).send({ message: "Error al eliminar el movimiento" });
    }
};
