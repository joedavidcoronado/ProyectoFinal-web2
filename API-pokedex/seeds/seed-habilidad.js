// seed-habilidades.js
const { sequelize } = require("../config/db.config");
const db = require("../models"); // Asegúrate de que ./models/index.js exporta Habilidad

const habilidades = [
  { nombre: "Levitate" },
  { nombre: "Overgrow" },
  { nombre: "Blaze" },
  { nombre: "Torrent" },
  { nombre: "Static" },
  { nombre: "Cute Charm" },
  { nombre: "Pickup" },
  { nombre: "Guts" },
  { nombre: "Sturdy" },
  { nombre: "Adaptability" },
];

async function seedHabilidades() {
  try {
    // await sequelize.sync({ force: true }); // cuidado: borra todas las tablas
    console.log("Conectado a la base de datos.");

    for (const hab of habilidades) {
      await db.habilidad.create(hab);
      console.log(`✅ Habilidad creada: ${hab.nombre}`);
    }

    console.log("🎉 Todas las habilidades fueron insertadas.");
  } catch (error) {
    console.error("❌ Error al insertar habilidades:", error);
  } finally {
    await sequelize.close();
  }
}

seedHabilidades();
