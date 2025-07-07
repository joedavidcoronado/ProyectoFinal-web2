const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("Item", {
        nombre: { type: DataTypes.STRING, allowNull: false },
        descripcion: DataTypes.STRING
    });
};
