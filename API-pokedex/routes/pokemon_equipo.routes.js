const { requireUser } = require("../middlewares/requires-user.js");

module.exports = app => {
    let router = require("express").Router();
    const controller = require("../controllers/pokemon_equipo.controller.js");

    //RUTAS
    router.get("/", requireUser, controller.getPokemonEquipoList);
    router.get("/:pokemonId/:equipoId", requireUser, controller.getPokemonEquipoDetalle);
    router.post("/", requireUser, controller.postPokemonEquipo);
    router.put("/:pokemonId/:equipoId", requireUser, controller.putPokemonEquipo);
    router.delete("/:pokemon_equipoId/:equipoId", requireUser, controller.deletePokemon_equipo);

    app.use('/pokemones_equipo', router);
};