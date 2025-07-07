const { adminUser } = require("../middlewares/admin-user.js");
const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/movimiento.controller.js");

    //RUTAS
    router.get("/all", requireUser, adminUser, controller.getAllMovimientoList);
    router.get("/:id", requireUser, controller.getMovimientoList);
    router.post("/", requireUser, adminUser, controller.postMovimiento);
    router.put("/:id", requireUser, adminUser, controller.updateMovimiento);
    router.delete("/:id", requireUser, adminUser, controller.deleteMovimiento);


    app.use('/movimientos', router);
};