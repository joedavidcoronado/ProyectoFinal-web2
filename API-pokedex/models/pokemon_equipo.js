const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("PokemonEquipo", {
        apodo: DataTypes.STRING,
        ev_hp: DataTypes.INTEGER,
        ev_attack: DataTypes.INTEGER,
        ev_defense: DataTypes.INTEGER,
        ev_sp_atk: DataTypes.INTEGER,
        ev_sp_def: DataTypes.INTEGER,
        ev_speed: DataTypes.INTEGER,
        iv_hp: DataTypes.INTEGER,
        iv_attack: DataTypes.INTEGER,
        iv_defense: DataTypes.INTEGER,
        iv_sp_atk: DataTypes.INTEGER,
        iv_sp_def: DataTypes.INTEGER,
        iv_speed: DataTypes.INTEGER,
        itemId: DataTypes.INTEGER,
        tipoId: DataTypes.INTEGER,
        naturalezaId: DataTypes.INTEGER,
        pokemonId: DataTypes.INTEGER,
        equipoId: DataTypes.INTEGER
    });
};
