const { requireUser } = require("../middlewares/requires-user.js");
const { adminUser } = require("../middlewares/admin-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/item.controller.js");

    //RUTAS
    router.get("/", requireUser, controller.getItemList);
    router.post("/", requireUser, adminUser, controller.postItem);
    router.put("/:id", requireUser, adminUser, controller.updateItem);
    router.delete("/:id", requireUser, adminUser, controller.deleteItem);

    app.use('/items', router);
};