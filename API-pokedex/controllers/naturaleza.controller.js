const db = require("../models/");

exports.getNaturalezaList = async (req, res) => {
    try {
        const naturalezas = await db.naturaleza.findAll();
        res.send(naturalezas);
    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener las naturalezas' });
    }
};