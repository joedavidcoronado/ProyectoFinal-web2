const { adminUser } = require("../middlewares/admin-user.js");
const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/habilidad.controller.js");

    //RUTAS
    router.get("/", requireUser, controller.getHabilidadList);
    router.post("/", requireUser, adminUser, controller.postHabilidad);
    router.put("/:id", requireUser, adminUser, controller.updateHabilidad);
    router.delete("/:id", requireUser, adminUser, controller.deleteHabilidad);


    app.use('/habilidades', router);
};