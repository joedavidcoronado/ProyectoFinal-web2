const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("Logro", {
        clave:       { type: DataTypes.STRING, allowNull: false, unique: true },
        nombre:      { type: DataTypes.STRING, allowNull: false },
        descripcion: { type: DataTypes.STRING, allowNull: false },
        xp:          { type: DataTypes.INTEGER, allowNull: false }
    }, {
        timestamps: false
    });
};