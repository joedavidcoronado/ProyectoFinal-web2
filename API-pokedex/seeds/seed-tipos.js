const { sequelize } = require("../config/db.config");
const db = require("../models"); 

async function verMovimientos() {
    try {
        // Asegúrate de tener bien configuradas las relaciones en /models/index.js
        const movi = await db.tipo.findAll();

        console.log("📋 Lista de Pokémon con atributos:");
        movi.forEach(p => {
            console.log(`\n🐾 ${p.nombre} (ID: ${p.id})`);
        });

    } catch (err) {
        console.error("❌ Error al obtener movimientos:", err);
    } finally {
        await sequelize.close();
    }
}

verMovimientos();
/*
// seed-tipos.js
const { sequelize } = require("./config/db.config");
const db = require("./models");

const tipos = [
  { id: 1, nombre: 'Normal' },
  { id: 2, nombre: 'Fuego' },
  { id: 3, nombre: 'Agua' },
  { id: 4, nombre: 'Eléctrico' },
  { id: 5, nombre: 'Planta' },
  { id: 6, nombre: 'Hielo' },
  { id: 7, nombre: 'Lucha' },
  { id: 8, nombre: 'Veneno' },
  { id: 9, nombre: 'Tierra' },
  { id: 10, nombre: 'Volador' },
  { id: 11, nombre: 'Psíquico' },
  { id: 12, nombre: 'Bicho' },
  { id: 13, nombre: 'Roca' },
  { id: 14, nombre: 'Fantasma' },
  { id: 15, nombre: 'Dragón' },
  { id: 16, nombre: 'Siniestro' },
  { id: 17, nombre: 'Acero' },
  { id: 18, nombre: 'Hada' }
];

async function seedTipos() {
  try {
    await sequelize.sync({ force: true });  // Si quieres reiniciar tablas
    console.log('Base de datos sincronizada.');

    for (const tipo of tipos) {
      await db.tipo.create(tipo);
      console.log(`Creado tipo: ${tipo.nombre}`);
    }

    console.log('Todos los tipos insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar tipos:', error);
  } finally {
    await sequelize.close();
  }
}

seedTipos();
*/