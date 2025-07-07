const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("Equipo", {
        nombre: { type: DataTypes.STRING, allowNull: false },
        usuarioId: { type: DataTypes.INTEGER, allowNull: false }
    });
};
