const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/naturaleza.controller.js");

    //RUTAS
    router.get("/", requireUser, controller.getNaturalezaList);

    app.use('/naturalezas', router);
};