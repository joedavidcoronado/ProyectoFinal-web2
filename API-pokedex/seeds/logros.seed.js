const db = require("../models/");

const logros = [
    { clave: "first_team",     nombre: "Primer Equipo",      descripcion: "Crea tu primer equipo",                xp: 50  },
    { clave: "first_pokemon",  nombre: "Primer Pokémon",     descripcion: "Agrega tu primer Pokémon a un equipo", xp: 20  },
    { clave: "team_complete",  nombre: "Equipo Completo",    descripcion: "Completa un equipo con 6 Pokémon",     xp: 100 },
    { clave: "pokemon_edited", nombre: "Entrenador Serio",   descripcion: "Edita un Pokémon por primera vez",     xp: 15  },
    { clave: "multi_team",     nombre: "Multi Equipo",       descripcion: "Ten más de un equipo activo",          xp: 75  },
    { clave: "team_builder_3", nombre: "Estratega",          descripcion: "Crea 3 equipos",                       xp: 120 },
    { clave: "collector_10",   nombre: "Coleccionista",      descripcion: "Agrega 10 Pokémon en total",           xp: 80  },
    { clave: "first_battle", nombre: "Tu primera ballata", descripcion: "Juega tu primera batlla pokemon", xp: 50 },
    { clave: "first_win", nombre: "Primera Victoria", descripcion: "Gana tu primera batalla", xp: 75},
    { clave: "win_streak_3", nombre: "Racha Ganadora", descripcion: "Gana 3 batallas seguidas", xp: 150},
    { clave: "veteran_10", nombre: "Veterano", descripcion: "Participa en 10 batallas", xp: 200}
];

async function seedLogros() {
    await db.sequelize.sync();
    for (const logro of logros) {
        await db.logro.findOrCreate({ where: { clave: logro.clave }, defaults: logro });
    }
    console.log("Logros seedeados correctamente");
    process.exit(0);
}

seedLogros();