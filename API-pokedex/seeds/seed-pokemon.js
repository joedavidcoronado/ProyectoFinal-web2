const { sequelize } = require("../config/db.config"); // Ajusta si tu archivo está en otra ruta
const db = require("../models"); // Asegúrate de tener un index.js que exporte todos los modelos

async function verPokemones() {
  try {
    // Asegúrate de tener bien configuradas las relaciones en /models/index.js
    const pokemones = await db.pokemon.findAll();

    console.log("📋 Lista de Pokémon con atributos:");
    pokemones.forEach(p => {
      console.log(`\n🐾 ${p.nombre} (ID: ${p.id}) (tipoId: ${p.tipoId}) (HP: ${p.hp})`);
    });

  } catch (err) {
    console.error("❌ Error al obtener Pokémon:", err);
  } finally {
    await sequelize.close();
  }
}

verPokemones();

// seed-pokemons.js
/*
const { sequelize } = require("./config/db.config");
const db = require("./models");

const pokemons = [
  { id: 1, nombre: 'Bulbasaur', tipoId: 5, hp: 45, attack: 49, defense: 49, spAtk: 65, spDef: 65, speed: 45 },
  { id: 2, nombre: 'Charmander', tipoId: 2, hp: 39, attack: 52, defense: 43, spAtk: 60, spDef: 50, speed: 65 },
  { id: 3, nombre: 'Squirtle', tipoId: 3, hp: 44, attack: 48, defense: 65, spAtk: 50, spDef: 64, speed: 43 },
  { id: 4, nombre: 'Pikachu', tipoId: 4, hp: 35, attack: 55, defense: 40, spAtk: 50, spDef: 50, speed: 90 },
  { id: 5, nombre: 'Jigglypuff', tipoId: 18, hp: 115, attack: 45, defense: 20, spAtk: 45, spDef: 25, speed: 20 },
  { id: 6, nombre: 'Meowth', tipoId: 1, hp: 40, attack: 45, defense: 35, spAtk: 40, spDef: 40, speed: 90 },
  { id: 7, nombre: 'Machop', tipoId: 7, hp: 70, attack: 80, defense: 50, spAtk: 35, spDef: 35, speed: 35 },
  { id: 8, nombre: 'Gastly', tipoId: 14, hp: 30, attack: 35, defense: 30, spAtk: 100, spDef: 35, speed: 80 },
  { id: 9, nombre: 'Onix', tipoId: 13, hp: 35, attack: 45, defense: 160, spAtk: 30, spDef: 45, speed: 70 },
  { id: 10, nombre: 'Eevee', tipoId: 1, hp: 55, attack: 55, defense: 50, spAtk: 45, spDef: 65, speed: 55 },
];

async function seedPokemons() {
  try {
    console.log('Conectando a la base de datos...');
    await sequelize.sync(); // No uses { force: true } si ya tienes tipos
    console.log('Base de datos sincronizada.');

    for (const pkm of pokemons) {
      await db.pokemon.create(pkm);
      console.log(`✅ Creado Pokémon: ${pkm.nombre}`);
    }

    console.log('✅ Todos los Pokémon fueron insertados correctamente.');
  } catch (error) {
    console.error('❌ Error al insertar Pokémon:', error);
  } finally {
    await sequelize.close();
  }
}

seedPokemons();


*/

