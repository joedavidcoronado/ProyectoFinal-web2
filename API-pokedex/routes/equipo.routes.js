const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/equipo.controller.js");

    //RUTAS
    router.get("/:correo", requireUser, controller.getEquipoList);
    router.get("/equipodetalle/:equipoId", requireUser, controller.getEquipoDetalle);
    router.post("/crear", requireUser, controller.createEquipo);
    router.delete("/:equipoId", requireUser, controller.deleteEquipo);
    router.put("/:equipo_id", requireUser, controller.updateEquipo);

    app.use('/equipos', router);
};