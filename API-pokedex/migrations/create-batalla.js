// migrations/create-batalla.js
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Batallas", {
            id:               { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
            usuarioId:        { type: Sequelize.INTEGER, allowNull: false },
            equipoId:         { type: Sequelize.INTEGER, allowNull: false },
            resultado:        { type: Sequelize.ENUM("victoria", "derrota"), allowNull: false },
            turnosTotales:    { type: Sequelize.INTEGER },
            equipoRivalNombre:{ type: Sequelize.STRING },
            createdAt:        { type: Sequelize.DATE },
            updatedAt:        { type: Sequelize.DATE },
        });
    },
    down: async (queryInterface) => {
        await queryInterface.dropTable("Batallas");
    }
};