const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("Movimiento", {
        nombre: { type: DataTypes.STRING, allowNull: false },
        tipoId: { type: DataTypes.INTEGER },
        power: { type: DataTypes.INTEGER },
        categoria: {
            type: DataTypes.ENUM("Físico", "Especial", "Estado"),
            defaultValue: "Físico"
        }
    });
};
