const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("Habilidad", {
        nombre: { type: DataTypes.STRING, allowNull: false }
    });
};
