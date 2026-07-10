const { sequelize } = require("../config/db.config"); // Ajusta si tu archivo está en otra ruta
const db = require("../models"); // Ajusta si usas otro nombre o estructura

async function verPokemonEquipos() {
  try {
    const pokemonEquipos = await db.pokemon_equipo.findAll({
      include: [
        { model: db.habilidad, as: 'habilidadesRel' },   // nombre exacto según asociación
        { model: db.movimiento, as: 'movimientosRel' },
        { model: db.item, as: 'item' },
        { model: db.naturaleza, as: 'naturaleza' },
        { model: db.tipo, as: 'tipo' },
        { model: db.pokemon, as: 'base' },
      ],
    });

    console.log("📋 Lista de Pokémon Equipos con todos sus detalles:");

    pokemonEquipos.forEach(pe => {
      console.log(`\n🆔 ID: ${pe.id} - Apodo: ${pe.apodo}`);
      console.log(`EVs: HP ${pe.ev_hp}, Atk ${pe.ev_attack}, Def ${pe.ev_defense}, SpAtk ${pe.ev_sp_atk}, SpDef ${pe.ev_sp_def}, Spd ${pe.ev_speed}`);
      console.log(`IVs: HP ${pe.iv_hp}, Atk ${pe.iv_attack}, Def ${pe.iv_defense}, SpAtk ${pe.iv_sp_atk}, SpDef ${pe.iv_sp_def}, Spd ${pe.iv_speed}`);
      console.log(`Item: ${pe.item?.nombre || 'N/A'}`);
      console.log(`Tipo: ${pe.tipo?.nombre || 'N/A'}${pe.tipo.id}`);
      console.log(`Naturaleza: ${pe.naturaleza?.nombre || 'N/A'}`);
      console.log(`Pokémon base: ${pe.base?.nombre || 'N/A'}`);

      console.log("Movimientos:");
      pe.movimientosRel.forEach(mov => {
        console.log(`  - ${mov.nombre} (Tipo: ${mov.tipoId}, Poder: ${mov.power})`);
      });

      console.log("Habilidades:");
      pe.habilidadesRel.forEach(hab => {
        console.log(`  - ${hab.nombre}`);
      });
    });

  } catch (err) {
    console.error("❌ Error al obtener Pokémon Equipos:", err);
  } finally {
    await sequelize.close();
  }
}

verPokemonEquipos();
