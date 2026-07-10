/*const { sequelize } = require("./config/db.config");
const db = require("./models");

const naturalezas = [
    { nombre: "Fuerte", stacks_beneficiado: "Ninguno", stacks_perjudicado: "Ninguno" },         // Hardy
    { nombre: "Solitaria", stacks_beneficiado: "attack", stacks_perjudicado: "defense" },       // Lonely
    { nombre: "Valiente", stacks_beneficiado: "attack", stacks_perjudicado: "speed" },          // Brave
    { nombre: "Firme", stacks_beneficiado: "attack", stacks_perjudicado: "spAtk" },             // Adamant
    { nombre: "Pícara", stacks_beneficiado: "attack", stacks_perjudicado: "spDef" },            // Naughty
    { nombre: "Osada", stacks_beneficiado: "defense", stacks_perjudicado: "attack" },           // Bold
    { nombre: "Docil", stacks_beneficiado: "Ninguno", stacks_perjudicado: "Ninguno" },          // Docile
    { nombre: "Plácida", stacks_beneficiado: "defense", stacks_perjudicado: "speed" },          // Relaxed
    { nombre: "Agitada", stacks_beneficiado: "defense", stacks_perjudicado: "spAtk" },          // Impish
    { nombre: "Alocada", stacks_beneficiado: "defense", stacks_perjudicado: "spDef" },          // Lax
    { nombre: "Miedosa", stacks_beneficiado: "speed", stacks_perjudicado: "attack" },           // Timid
    { nombre: "Activa", stacks_beneficiado: "speed", stacks_perjudicado: "defense" },           // Hasty
    { nombre: "Seria", stacks_beneficiado: "Ninguno", stacks_perjudicado: "Ninguno" },          // Serious
    { nombre: "Alegre", stacks_beneficiado: "speed", stacks_perjudicado: "spAtk" },             // Jolly
    { nombre: "Ingenua", stacks_beneficiado: "speed", stacks_perjudicado: "spDef" },            // Naive
    { nombre: "Modesta", stacks_beneficiado: "spAtk", stacks_perjudicado: "attack" },           // Modest
    { nombre: "Afable", stacks_beneficiado: "spAtk", stacks_perjudicado: "defense" },           // Mild
    { nombre: "Mansa", stacks_beneficiado: "spAtk", stacks_perjudicado: "speed" },              // Quiet
    { nombre: "Floja", stacks_beneficiado: "Ninguno", stacks_perjudicado: "Ninguno" },          // Bashful
    { nombre: "Rash", stacks_beneficiado: "spAtk", stacks_perjudicado: "spDef" },            // Rash
    { nombre: "Serena", stacks_beneficiado: "spDef", stacks_perjudicado: "attack" },            // Calm
    { nombre: "Amable", stacks_beneficiado: "spDef", stacks_perjudicado: "defense" },           // Gentle
    { nombre: "Grosera", stacks_beneficiado: "spDef", stacks_perjudicado: "speed" },            // Sassy
    { nombre: "Cauta", stacks_beneficiado: "spDef", stacks_perjudicado: "spAtk" },              // Careful
    { nombre: "Rara", stacks_beneficiado: "Ninguno", stacks_perjudicado: "Ninguno" },           // Quirky
];

const seedNaturalezas = async () => {
    try {
        await sequelize.sync(); // Asegura que la conexión esté lista
        await db.naturaleza.bulkCreate(naturalezas);
        console.log("✅ Naturalezas insertadas correctamente");
    } catch (error) {
        console.error("❌ Error insertando naturalezas:", error);
    } finally {
        await sequelize.close(); // Cerramos conexión
    }
};

seedNaturalezas();*/

const { sequelize } = require("../config/db.config");
const db = require("../models");

async function verNaturalezas() {
  try {
    const naturalezas = await db.naturaleza.findAll();

    console.log("📋 Lista de Pokémon con atributos:");
    naturalezas.forEach(n => {
      console.log(`\n🐾(ID: ${n.id}) ${n.nombre} (Beneficiado: ${n.stacks_beneficiado}) (Perjudicado: ${n.stacks_perjudicado})`);
    });

  } catch (err) {
    console.error("❌ Error al obtener naturalezas:", err);
  } finally {
    await sequelize.close();
  }
}

verNaturalezas();