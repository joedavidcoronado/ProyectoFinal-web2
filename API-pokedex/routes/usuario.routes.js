const { adminUser } = require("../middlewares/admin-user.js");
const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/usuario.controller.js");

    //RUTAS
    router.get("/", requireUser, adminUser, controller.getUsuarioList);
    router.get("/:id", requireUser, controller.getUsuarioById);
    router.get("/correo/:correo", requireUser, controller.getUsuarioByEmail);
    router.put("/rol/:id", requireUser, adminUser, controller.cambiarRolUsuario);


    app.use('/usuarios', router);
};