module.exports = app => {
    require("./habilidad.routes.js")(app);
    require("./usuario.routes.js")(app);
    require("./imagen.routes.js")(app);
    require("./equipo.routes")(app);
    require("./item.routes")(app);
    require("./movimiento.routes.js")(app);
    require("./naturaleza.routes.js")(app);
    require("./pokemon.routes.js")(app);
    require("./pokemon_equipo.routes.js")(app);
    require("./tipo.routes.js")(app);
    require('./auth.routes')(app);
}