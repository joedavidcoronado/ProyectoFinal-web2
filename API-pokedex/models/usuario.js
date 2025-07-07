const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("Usuario", {
        nombre: { type: DataTypes.STRING, allowNull: false },
        correo: { type: DataTypes.STRING, allowNull: false, unique: true },
        contraseña: { type: DataTypes.STRING, allowNull: false },
        tipo: { type: DataTypes.ENUM("admin", "normal"), defaultValue: "normal" }
    });
};
