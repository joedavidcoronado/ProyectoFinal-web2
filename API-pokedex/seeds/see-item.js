const { sequelize } = require("../config/db.config"); // Ajusta ruta si es necesario
const ItemModel = require("../models/item"); // Ajusta ruta si es necesario

const Item = ItemModel(sequelize);

const itemsSeed = [
  { nombre: "Poción", descripcion: "Restaura 20 puntos de vida." },
  { nombre: "Antídoto", descripcion: "Cura el envenenamiento." },
  { nombre: "Revivir", descripcion: "Revive a un Pokémon debilitado con la mitad de su salud." },
  { nombre: "Baya Zreza", descripcion: "Cura el estado de confusión." },
  { nombre: "Restos", descripcion: "Restaura un poco de salud cada turno." },
  { nombre: "Cinta Elegida", descripcion: "Aumenta el poder de un movimiento elegido." },
  { nombre: "Gafas Elegidas", descripcion: "Aumenta el poder de movimientos especiales." },
  { nombre: "Hierba Cura", descripcion: "Cura el envenenamiento, parálisis o quemaduras." },
  { nombre: "Caramelo Raro", descripcion: "Aumenta un nivel de experiencia." },
  { nombre: "Piedra Fuego", descripcion: "Evoluciona ciertos Pokémon." }
];

async function seedItems() {
  try {
    await sequelize.sync();
    await Item.bulkCreate(itemsSeed, { ignoreDuplicates: true });
    console.log("✅ Items insertados correctamente.");
  } catch (error) {
    console.error("❌ Error insertando items:", error);
  } finally {
    await sequelize.close();
  }
}

seedItems();
