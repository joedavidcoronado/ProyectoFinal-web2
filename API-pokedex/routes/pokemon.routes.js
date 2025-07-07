const { adminUser } = require("../middlewares/admin-user.js");
const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/pokemon.controller.js");

    //RUTAS
    router.get("/", requireUser, controller.getPokemonList);
    router.get("/:id", requireUser, controller.getPokemonById);
    router.post("/", requireUser, adminUser, controller.postPokemon);
    router.get("/buscar/:nombre", requireUser, controller.getPokemonByName);
    router.put("/:id", requireUser, adminUser, controller.updatePokemon);
    router.delete("/:id", requireUser, adminUser, controller.deletePokemon);

    app.use('/pokemones', router);
};