const { sequelize } = require("../config/db.config");

const usuario = require("./usuario")(sequelize);
const equipo = require("./equipo")(sequelize);
const pokemon = require("./pokemon")(sequelize);
const tipo = require("./tipo")(sequelize);
const item = require("./item")(sequelize);
const habilidad = require("./habilidad")(sequelize);
const movimiento = require("./movimiento")(sequelize);
const naturaleza = require("./naturaleza")(sequelize);
const pokemon_equipo = require("./pokemon_equipo")(sequelize);
const authToken = require("./authToken")(sequelize);
const logro        = require("./logro")(sequelize);
const usuarioLogro = require("./usuarioLogro")(sequelize);
const batalla = require("./batalla")(sequelize);

// 1. usuario - equipo (1:N)
usuario.hasMany(equipo, { foreignKey: "usuarioId", as: "equipos" });
equipo.belongsTo(usuario, { foreignKey: "usuarioId", as: "usuario" });

// logro - usuarioLogro (1:N)
logro.hasMany(usuarioLogro, { foreignKey: "logroId", as: "desbloqueos" });
usuarioLogro.belongsTo(logro, { foreignKey: "logroId", as: "logro" });

// usuario - usuarioLogro (1:N)
usuario.hasMany(usuarioLogro, { foreignKey: "usuarioId", as: "logros" });
usuarioLogro.belongsTo(usuario, { foreignKey: "usuarioId", as: "usuario" });

// 2. equipo - pokemon_equipo (1:N)
equipo.hasMany(pokemon_equipo, { foreignKey: "equipoId", as: "pokemonesequipo" });
pokemon_equipo.belongsTo(equipo, { foreignKey: "equipoId", as: "equipo" });

// 3. pokemon - pokemon_equipo (1:N)
pokemon.hasMany(pokemon_equipo, { foreignKey: "pokemonId", as: "instancias" });
pokemon_equipo.belongsTo(pokemon, { foreignKey: "pokemonId", as: "base" });

// 4. tipo - pokemon (1:1)
tipo.hasMany(pokemon, { foreignKey: "tipoId", as: "pokemones" });
pokemon.belongsTo(tipo, { foreignKey: "tipoId", as: "tipo" });

// 5. tipo - pokemon_equipo (1:1)
tipo.hasMany(pokemon_equipo, { foreignKey: "tipoId", as: "pokemonesequipotipo" });
pokemon_equipo.belongsTo(tipo, { foreignKey: "tipoId", as: "tipo" });

// 6. item - pokemon_equipo (1:1)
item.hasMany(pokemon_equipo, { foreignKey: "itemId", as: "usos" });
pokemon_equipo.belongsTo(item, { foreignKey: "itemId", as: "item" });

// 7. naturaleza - pokemon_equipo (1:1)
naturaleza.hasMany(pokemon_equipo, { foreignKey: "naturalezaId", as: "pokemones" });
pokemon_equipo.belongsTo(naturaleza, { foreignKey: "naturalezaId", as: "naturaleza" });

// 8. habilidad - pokemon_equipo (N:M)
pokemon_equipo.belongsToMany(habilidad, {
    through: "pokemon_equipo_habilidad",
    as: "habilidadesRel",
    foreignKey: "pokemon_equipoId"
});
habilidad.belongsToMany(pokemon_equipo, {
    through: "pokemon_equipo_habilidad",
    as: "pokemones",
    foreignKey: "habilidadId"
});

// 9. movimiento - pokemon_equipo (N:M)
pokemon_equipo.belongsToMany(movimiento, {
    through: "pokemon_equipo_movimiento",
    as: "movimientosRel",
    foreignKey: "pokemon_equipoId"
});
movimiento.belongsToMany(pokemon_equipo, {
    through: "pokemon_equipo_movimiento",
    as: "pokemones",
    foreignKey: "movimientoId"
});

// 10. usuario - authToken (1:N)
usuario.hasMany(authToken, {
    foreignKey: "usuarioId",
    sourceKey: "id",
    as: "tokens"
});

authToken.belongsTo(usuario, {
    foreignKey: "usuarioId",
    as: "usuario"
});

batalla.belongsTo(usuario, { foreignKey: "usuarioId" });
batalla.belongsTo(equipo,  { foreignKey: "equipoId" });


module.exports = {
    usuario,
    equipo,
    pokemon,
    tipo,
    item,
    habilidad,
    movimiento,
    naturaleza,
    pokemon_equipo,
    sequelize,
    authToken,
    logro,
    usuarioLogro,
    batalla,
    Sequelize: sequelize.Sequelize
};
