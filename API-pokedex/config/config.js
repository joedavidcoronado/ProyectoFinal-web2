// config/config.js
module.exports = {
  development: {
    dialect: "sqlite",
    storage: "./database.sqlite" // Apuesta a la misma base de datos de tu app
  },
  test: {
    dialect: "sqlite",
    storage: "./database.sqlite"
  },
  production: {
    dialect: "sqlite",
    storage: "./database.sqlite"
  }
};