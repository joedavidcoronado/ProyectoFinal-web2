const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("Pokemon", {
        nombre: DataTypes.STRING,
        hp: DataTypes.INTEGER,
        attack: DataTypes.INTEGER,
        defense: DataTypes.INTEGER,
        spAtk: DataTypes.INTEGER,
        spDef: DataTypes.INTEGER,
        speed: DataTypes.INTEGER,
        tipoId: DataTypes.INTEGER 
    });
};
