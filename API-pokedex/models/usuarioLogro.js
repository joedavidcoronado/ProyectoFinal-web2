const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("UsuarioLogro", {
        usuarioId:       { type: DataTypes.INTEGER, allowNull: false },
        logroId:         { type: DataTypes.INTEGER, allowNull: false },
        desbloqueadoEn:  { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, {
        timestamps: false
    });
};