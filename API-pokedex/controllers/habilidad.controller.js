const db = require("../models/");

exports.getHabilidadList = async (req, res) => {
    try {
        const habilidades = await db.habilidad.findAll();
        res.send(habilidades);
    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener las habilidades' });
    }
};

exports.postHabilidad = async (req, res) => {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
        return res.status(400).send({ message: "El nombre de la habilidad es obligatorio." });
    }

    try {
        const existente = await db.habilidad.findOne({ where: { nombre } });

        if (existente) {
            return res.status(400).send({ message: "Ya existe una habilidad con ese nombre." });
        }

        const nueva = await db.habilidad.create({ nombre });
        res.status(201).send(nueva);
    } catch (error) {
        console.error("Error al crear habilidad:", error);
        res.status(500).send({ message: "Error al crear la habilidad." });
    }
};


exports.updateHabilidad = async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
        return res.status(400).send({ message: "El nombre es requerido" });
    }

    try {
        const habilidad = await db.habilidad.findByPk(id);
        if (!habilidad) {
            return res.status(404).send({ message: "Habilidad no encontrada" });
        }

        habilidad.nombre = nombre;
        await habilidad.save();

        res.send({ message: "Habilidad actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar habilidad:", error);
        res.status(500).send({ message: "Error interno al actualizar habilidad" });
    }
};

exports.deleteHabilidad = async (req, res) => {
    const { id } = req.params;

    if (!id || id === "") {
        return res.status(400).send({ message: "El id es requerido" });
    }

    try {
        const habilidad = await db.habilidad.destroy({
                    where: { id: id },
                });
        if (habilidad === 0) {
            return res.status(404).send({ message: "Habilidad no encontrada" });
        }
        res.send({ message: "Habilidad actualizada correctamente" });
    } catch (error) {
        console.error("Error al actualizar habilidad:", error);
        res.status(500).send({ message: "Error interno al actualizar habilidad" });
    }
};