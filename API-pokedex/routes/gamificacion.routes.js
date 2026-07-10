const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    const router = require("express").Router();
    const controller = require("../controllers/gamificacion.controller.js");

    router.get("/perfil", requireUser, controller.getPerfilGamificacion);
    router.get("/xp",     requireUser, controller.getXpTotal);
    router.get("/ranking", requireUser, controller.getRanking);

    app.use('/gamificacion', router);
};