const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("Tipo", {
        nombre: { type: DataTypes.STRING, allowNull: false }
    });
};
