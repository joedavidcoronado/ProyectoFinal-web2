/*const { sequelize } = require("./config/db.config"); // Ajusta si tu archivo está en otra ruta
const db = require("./models"); // Asegúrate de tener un index.js que exporte todos los modelos

async function verMovimientos() {
    try {
        // Asegúrate de tener bien configuradas las relaciones en /models/index.js
        const movi = await db.movimiento.findAll();

        console.log("📋 Lista de Pokémon con atributos:");
        movi.forEach(p => {
            console.log(`\n🐾 ${p.nombre} (ID: ${p.id}) (tipoId: ${p.tipoId})`);
        });

    } catch (err) {
        console.error("❌ Error al obtener movimientos:", err);
    } finally {
        await sequelize.close();
    }
}

verMovimientos();*/

// PARA BORRAR MOVIMIENTOS
/*const { sequelize } = require("./config/db.config"); // Ajusta el path si es necesario
const db = require("./models"); // Asegúrate de que este index.js exporte todos los modelos

async function borrarMovimientos() {
  try {
    await sequelize.sync(); // Asegura conexión

    const count = await db.movimiento.destroy({ where: {}, truncate: false }); // truncate: true también reinicia IDs
    console.log(`✅ Se borraron ${count} movimientos.`);
  } catch (error) {
    console.error("❌ Error al borrar los movimientos:", error);
  } finally {
    await sequelize.close();
  }
}

borrarMovimientos();*/


// PARA INSERTAR MOVIMIENTOS
/*const { sequelize } = require("./config/db.config");
const MovimientoModel = require("./models/movimiento");

const Movimiento = MovimientoModel(sequelize);

async function seedMovimientos() {
  try {
    await sequelize.sync();

    const movimientosData = [
  { tipoId: 1, nombre: "Golpe Cuerpo", power: 85 },
  { tipoId: 1, nombre: "Placaje", power: 40 },
  { tipoId: 1, nombre: "Doble Filo", power: 120 },
  { tipoId: 1, nombre: "Ataque Rápido", power: 40 },
  { tipoId: 1, nombre: "Destructor", power: 35 },

  { tipoId: 2, nombre: "Lanzallamas", power: 90 },
  { tipoId: 2, nombre: "Ascuas", power: 40 },
  { tipoId: 2, nombre: "Giro Fuego", power: 35 },
  { tipoId: 2, nombre: "Rueda Fuego", power: 60 },
  { tipoId: 2, nombre: "Envite Ígneo", power: 120 },

  { tipoId: 3, nombre: "Surf", power: 90 },
  { tipoId: 3, nombre: "Pistola Agua", power: 40 },
  { tipoId: 3, nombre: "Hidrobomba", power: 110 },
  { tipoId: 3, nombre: "Burbuja", power: 20 },
  { tipoId: 3, nombre: "Acua Jet", power: 40 },

  { tipoId: 4, nombre: "Impactrueno", power: 40 },
  { tipoId: 4, nombre: "Trueno", power: 110 },
  { tipoId: 4, nombre: "Rayo", power: 90 },
  { tipoId: 4, nombre: "Chispa", power: 65 },
  { tipoId: 4, nombre: "Onda Trueno", power: 0 },

  { tipoId: 5, nombre: "Hoja Afilada", power: 55 },
  { tipoId: 5, nombre: "Drenadoras", power: 0 },
  { tipoId: 5, nombre: "Rayo Solar", power: 120 },
  { tipoId: 5, nombre: "Latigazo", power: 120 },
  { tipoId: 5, nombre: "Absorber", power: 20 },

  { tipoId: 6, nombre: "Ventisca", power: 110 },
  { tipoId: 6, nombre: "Nieve Polvo", power: 40 },
  { tipoId: 6, nombre: "Rayo Hielo", power: 90 },
  { tipoId: 6, nombre: "Granizo", power: 0 },
  { tipoId: 6, nombre: "Viento Hielo", power: 55 },

  { tipoId: 7, nombre: "Puño Fuego", power: 75 },
  { tipoId: 7, nombre: "Golpe Karate", power: 50 },
  { tipoId: 7, nombre: "Patada Baja", power: 0 },
  { tipoId: 7, nombre: "Puño Dinámico", power: 100 },
  { tipoId: 7, nombre: "Revoleo", power: 60 },

  { tipoId: 8, nombre: "Picotazo Veneno", power: 15 },
  { tipoId: 8, nombre: "Bomba Lodo", power: 90 },
  { tipoId: 8, nombre: "Lanza Mugre", power: 120 },
  { tipoId: 8, nombre: "Ácido", power: 40 },
  { tipoId: 8, nombre: "Gas Venenoso", power: 0 },

  { tipoId: 9, nombre: "Terremoto", power: 100 },
  { tipoId: 9, nombre: "Disparo Lodo", power: 20 },
  { tipoId: 9, nombre: "Bofetón Lodo", power: 20 },
  { tipoId: 9, nombre: "Fuerza Telúrica", power: 90 },
  { tipoId: 9, nombre: "Ataque Arena", power: 0 },

  { tipoId: 10, nombre: "Golpe Aéreo", power: 60 },
  { tipoId: 10, nombre: "Ataque Ala", power: 60 },
  { tipoId: 10, nombre: "Vuelo", power: 90 },
  { tipoId: 10, nombre: "Danza Aérea", power: 70 },
  { tipoId: 10, nombre: "Tornado", power: 40 },

  { tipoId: 11, nombre: "Psíquico", power: 90 },
  { tipoId: 11, nombre: "Confusión", power: 50 },
  { tipoId: 11, nombre: "Premonición", power: 120 },
  { tipoId: 11, nombre: "Poder Pasado", power: 60 },
  { tipoId: 11, nombre: "Telequinesis", power: 0 },

  { tipoId: 12, nombre: "Picadura", power: 60 },
  { tipoId: 12, nombre: "Disparo Demora", power: 0 },
  { tipoId: 12, nombre: "Golpe Bajo", power: 60 },
  { tipoId: 12, nombre: "Acoso", power: 20 },
  { tipoId: 12, nombre: "Zumbido", power: 90 },

  { tipoId: 13, nombre: "Avalancha", power: 75 },
  { tipoId: 13, nombre: "Lanzarrocas", power: 50 },
  { tipoId: 13, nombre: "Roca Afilada", power: 100 },
  { tipoId: 13, nombre: "Trampa Rocas", power: 0 },
  { tipoId: 13, nombre: "Poder Pasado", power: 60 },

  { tipoId: 14, nombre: "Tinieblas", power: 0 },
  { tipoId: 14, nombre: "Lengüetazo", power: 30 },
  { tipoId: 14, nombre: "Bola Sombra", power: 80 },
  { tipoId: 14, nombre: "Maldición", power: 0 },
  { tipoId: 14, nombre: "Infortunio", power: 65 },

  { tipoId: 15, nombre: "Garra Dragón", power: 80 },
  { tipoId: 15, nombre: "Pulso Dragón", power: 85 },
  { tipoId: 15, nombre: "Enfado", power: 120 },
  { tipoId: 15, nombre: "Cola Dragón", power: 60 },
  { tipoId: 15, nombre: "Carga Dragón", power: 100 },

  { tipoId: 16, nombre: "Finta", power: 60 },
  { tipoId: 16, nombre: "Triturar", power: 80 },
  { tipoId: 16, nombre: "Juego Sucio", power: 95 },
  { tipoId: 16, nombre: "Pulso Umbrío", power: 80 },
  { tipoId: 16, nombre: "Alarido", power: 55 },

  { tipoId: 17, nombre: "Cabeza de Hierro", power: 80 },
  { tipoId: 17, nombre: "Cañón Flash", power: 80 },
  { tipoId: 17, nombre: "Garra Metal", power: 50 },
  { tipoId: 17, nombre: "Puño Bala", power: 40 },
  { tipoId: 17, nombre: "Cuerpo Pesado", power: 0 },

  { tipoId: 18, nombre: "Brillo Mágico", power: 80 },
  { tipoId: 18, nombre: "Voz Cautivadora", power: 40 },
  { tipoId: 18, nombre: "Fuerza Lunar", power: 95 },
  { tipoId: 18, nombre: "Viento Feérico", power: 40 },
  { tipoId: 18, nombre: "Carantoña", power: 90 },
    ];

    await Movimiento.bulkCreate(movimientosData);

    console.log("✅ Movimientos insertados correctamente.");
  } catch (error) {
    console.error("❌ Error al insertar movimientos:", error);
  } finally {
    await sequelize.close();
  }
}

seedMovimientos();*/


// PARRA BORRAR MOVIMIENTOS
/*
const { sequelize } = require("./config/db.config"); // Ajusta si tu archivo está en otra ruta
const db = require("./models"); // Asegúrate de tener un index.js que exporte todos los modelos

async function resetMovimientos() {
  try {
    await db.movimiento.destroy({ where: {}, truncate: true });
    console.log("🧹 Todos los movimientos eliminados correctamente");
  } catch (error) {
    console.error("❌ Error al borrar movimientos:", error);
  }
}

resetMovimientos();*/

//PARA UPDATE
const { sequelize } = require("./config/db.config"); // Ajusta si tu archivo está en otra ruta
const db = require("./models"); // Asegúrate de tener un index.js que exporte todos los modelos

const movimientosSeed = [
  { tipoId: 1, nombre: "Golpe Cuerpo", power: 85 },
  { tipoId: 1, nombre: "Placaje", power: 40 },
  { tipoId: 1, nombre: "Doble Filo", power: 120 },
  { tipoId: 1, nombre: "Ataque Rápido", power: 40 },
  { tipoId: 1, nombre: "Destructor", power: 35 },
  { tipoId: 2, nombre: "Lanzallamas", power: 90 },
  { tipoId: 2, nombre: "Ascuas", power: 40 },
  { tipoId: 2, nombre: "Giro Fuego", power: 35 },
  { tipoId: 2, nombre: "Rueda Fuego", power: 60 },
  { tipoId: 2, nombre: "Envite Ígneo", power: 120 },
  { tipoId: 3, nombre: "Surf", power: 90 },
  { tipoId: 3, nombre: "Pistola Agua", power: 40 },
  { tipoId: 3, nombre: "Hidrobomba", power: 110 },
  { tipoId: 3, nombre: "Burbuja", power: 20 },
  { tipoId: 3, nombre: "Acua Jet", power: 40 },
  { tipoId: 4, nombre: "Impactrueno", power: 40 },
  { tipoId: 4, nombre: "Trueno", power: 110 },
  { tipoId: 4, nombre: "Rayo", power: 90 },
  { tipoId: 4, nombre: "Chispa", power: 65 },
  { tipoId: 4, nombre: "Onda Trueno", power: 0 },
  { tipoId: 5, nombre: "Hoja Afilada", power: 55 },
  { tipoId: 5, nombre: "Drenadoras", power: 0 },
  { tipoId: 5, nombre: "Rayo Solar", power: 120 },
  { tipoId: 5, nombre: "Latigazo", power: 120 },
  { tipoId: 5, nombre: "Absorber", power: 20 },
  { tipoId: 6, nombre: "Ventisca", power: 110 },
  { tipoId: 6, nombre: "Nieve Polvo", power: 40 },
  { tipoId: 6, nombre: "Rayo Hielo", power: 90 },
  { tipoId: 6, nombre: "Granizo", power: 0 },
  { tipoId: 6, nombre: "Viento Hielo", power: 55 },
  { tipoId: 7, nombre: "Puño Fuego", power: 75 },
  { tipoId: 7, nombre: "Golpe Karate", power: 50 },
  { tipoId: 7, nombre: "Patada Baja", power: 0 },
  { tipoId: 7, nombre: "Puño Dinámico", power: 100 },
  { tipoId: 7, nombre: "Revoleo", power: 60 },
  { tipoId: 8, nombre: "Picotazo Veneno", power: 15 },
  { tipoId: 8, nombre: "Bomba Lodo", power: 90 },
  { tipoId: 8, nombre: "Lanza Mugre", power: 120 },
  { tipoId: 8, nombre: "Ácido", power: 40 },
  { tipoId: 8, nombre: "Gas Venenoso", power: 0 },
  { tipoId: 9, nombre: "Terremoto", power: 100 },
  { tipoId: 9, nombre: "Disparo Lodo", power: 20 },
  { tipoId: 9, nombre: "Bofetón Lodo", power: 20 },
  { tipoId: 9, nombre: "Fuerza Telúrica", power: 90 },
  { tipoId: 9, nombre: "Ataque Arena", power: 0 },
  { tipoId: 10, nombre: "Golpe Aéreo", power: 60 },
  { tipoId: 10, nombre: "Ataque Ala", power: 60 },
  { tipoId: 10, nombre: "Vuelo", power: 90 },
  { tipoId: 10, nombre: "Danza Aérea", power: 70 },
  { tipoId: 10, nombre: "Tornado", power: 40 },
  { tipoId: 11, nombre: "Psíquico", power: 90 },
  { tipoId: 11, nombre: "Confusión", power: 50 },
  { tipoId: 11, nombre: "Premonición", power: 120 },
  { tipoId: 11, nombre: "Poder Pasado", power: 60 },
  { tipoId: 11, nombre: "Telequinesis", power: 0 },
  { tipoId: 12, nombre: "Picadura", power: 60 },
  { tipoId: 12, nombre: "Disparo Demora", power: 0 },
  { tipoId: 12, nombre: "Golpe Bajo", power: 60 },
  { tipoId: 12, nombre: "Acoso", power: 20 },
  { tipoId: 12, nombre: "Zumbido", power: 90 },
  { tipoId: 13, nombre: "Avalancha", power: 75 },
  { tipoId: 13, nombre: "Lanzarrocas", power: 50 },
  { tipoId: 13, nombre: "Roca Afilada", power: 100 },
  { tipoId: 13, nombre: "Trampa Rocas", power: 0 },
  { tipoId: 13, nombre: "Poder Pasado", power: 60 },
  { tipoId: 14, nombre: "Tinieblas", power: 0 },
  { tipoId: 14, nombre: "Lengüetazo", power: 30 },
  { tipoId: 14, nombre: "Bola Sombra", power: 80 },
  { tipoId: 14, nombre: "Maldición", power: 0 },
  { tipoId: 14, nombre: "Infortunio", power: 65 },
  { tipoId: 15, nombre: "Garra Dragón", power: 80 },
  { tipoId: 15, nombre: "Pulso Dragón", power: 85 },
  { tipoId: 15, nombre: "Enfado", power: 120 },
  { tipoId: 15, nombre: "Cola Dragón", power: 60 },
  { tipoId: 15, nombre: "Carga Dragón", power: 100 },
  { tipoId: 16, nombre: "Finta", power: 60 },
  { tipoId: 16, nombre: "Triturar", power: 80 },
  { tipoId: 16, nombre: "Juego Sucio", power: 95 },
  { tipoId: 16, nombre: "Pulso Umbrío", power: 80 },
  { tipoId: 16, nombre: "Alarido", power: 55 },
  { tipoId: 17, nombre: "Cabeza de Hierro", power: 80 },
  { tipoId: 17, nombre: "Cañón Flash", power: 80 },
  { tipoId: 17, nombre: "Garra Metal", power: 50 },
  { tipoId: 17, nombre: "Puño Bala", power: 40 },
  { tipoId: 17, nombre: "Cuerpo Pesado", power: 0 },
  { tipoId: 18, nombre: "Brillo Mágico", power: 80 },
  { tipoId: 18, nombre: "Voz Cautivadora", power: 40 },
  { tipoId: 18, nombre: "Fuerza Lunar", power: 95 },
  { tipoId: 18, nombre: "Viento Feérico", power: 40 },
  { tipoId: 18, nombre: "Carantoña", power: 90 }
];

(async () => {
  for (const mov of movimientosSeed) {
    const categoria =
      mov.power === 0
        ? "Estado"
        : mov.power <= 60
        ? "Físico"
        : "Especial";

    await db.movimiento.update(
      { categoria },
      { where: { nombre: mov.nombre, tipoId: mov.tipoId } }
    );
  }

  console.log("✅ Categorías actualizadas.");
  process.exit();
})();
