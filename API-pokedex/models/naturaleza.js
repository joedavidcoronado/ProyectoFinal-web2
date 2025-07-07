const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    return sequelize.define("Naturaleza", {
        nombre: DataTypes.STRING,
        stacks_beneficiado: DataTypes.STRING,
        stacks_perjudicado: DataTypes.STRING
    });
};
