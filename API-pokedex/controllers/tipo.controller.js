const db = require("../models/");

exports.getTipoList = async (req, res) => {
    try {
        const tipos = await db.tipo.findAll();
        res.send(tipos);
    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener los tipos' });
    }
};