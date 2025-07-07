const db = require("../models");

exports.getItemList = async (req, res) => {
    try {
        const items = await db.item.findAll();
        res.send(items);
    } catch (error) {
        console.error("Error en getItemList:", error);
        return res.status(500).send({ message: "Error al obtener los items" });
    }
};

exports.postItem = async (req, res) => {
    const { nombre, descripcion } = req.body;

    if (!nombre || typeof nombre !== "string" || nombre.trim() === "") {
        return res.status(400).send({ message: "El nombre del item es obligatorio y debe ser válido" });
    }

    try {
        const item = await db.item.create({ nombre: nombre.trim(), descripcion });
        res.status(201).send(item);
    } catch (error) {
        console.error("Error en postItem:", error);
        return res.status(500).send({ message: "Error al crear el item" });
    }
};

exports.updateItem = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const { id } = req.params;

    if (nombre !== undefined && (typeof nombre !== "string" || nombre.trim() === "")) {
        return res.status(400).send({ message: "El nombre debe ser un string válido" });
    }

    try {
        const item = await db.item.findByPk(id);

        if (!item) {
        return res.status(404).send({ message: "Item no encontrado" });
        }

        await item.update({
        nombre: nombre !== undefined ? nombre.trim() : item.nombre,
        descripcion: descripcion !== undefined ? descripcion : item.descripcion,
        });

        res.send({ message: "Item actualizado correctamente" });
    } catch (error) {
        console.error("Error en updateItem:", error);
        return res.status(500).send({ message: "Error al actualizar el item" });
    }
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
        return res.status(400).send({ message: "ID inválido" });
    }

    try {
        const deleted = await db.item.destroy({ where: { id } });

        if (!deleted) {
        return res.status(404).send({ message: "Item no encontrado" });
        }

        res.send({ message: "Item eliminado correctamente" });
    } catch (error) {
        console.error("Error en deleteItem:", error);
        return res.status(500).send({ message: "Error al eliminar el item" });
    }
};
