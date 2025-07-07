const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/tipo.controller.js");

    //RUTAS
    router.get("/", requireUser, controller.getTipoList);

    app.use('/tipos', router);
};