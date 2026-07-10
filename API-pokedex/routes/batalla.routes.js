// routes/batalla.routes.js
const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    const router = require("express").Router();
    const controller = require("../controllers/batalla.controller.js");

    router.post("/registrar", requireUser, controller.registrarBatalla);

    app.use('/batalla', router);
};