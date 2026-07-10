// models/batalla.model.js
const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("Batalla", {
        usuarioId:      { type: DataTypes.INTEGER, allowNull: false },
        equipoId:       { type: DataTypes.INTEGER, allowNull: false },
        resultado:      { type: DataTypes.ENUM("victoria", "derrota"), allowNull: false },
        turnosTotales:  { type: DataTypes.INTEGER },
        equipoRivalNombre: { type: DataTypes.STRING },
    });
};