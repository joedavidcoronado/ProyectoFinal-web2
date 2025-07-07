
const { Op } = require("sequelize");
const db = require("../models/");

exports.getPokemonList = async (req, res) => {
    try {
        const pokemones = await db.pokemon.findAll();
        res.send(pokemones);
    } catch (error) {
        return res.status(500).send({ message: 'Error al obtener los pokemones' });
    }
};

exports.postPokemon = async (req, res) => {
    const { nombre, hp, attack, defense, spAtk, spDef, speed, tipoId } = req.body;
    const camposRequeridos = { nombre, hp, attack, defense, spAtk, spDef, speed, tipoId };
    for (const [campo, valor] of Object.entries(camposRequeridos)) {
        if (!valor) {
            return res.status(400).send({ message: `El campo '${campo}' es requerido` });
        }
    }
    try {
        const pokemon = await db.pokemon.create({
            nombre,
            hp, 
            attack, 
            defense, 
            spAtk, 
            spDef, 
            speed, 
            tipoId
        });
        res.status(201).send(pokemon);
    } catch (error) {
        console.error("Error al crear el pokemon:", error);
        return res.status(500).send({ message: 'Error al crear el pokemon' });
    }
}
exports.getPokemonByName = async (req, res) => {
    try {
        const nombreBuscado = req.params.nombre;

        const pokemones = await db.pokemon.findAll({
            where: {
                nombre: {
                    [Op.like]: `%${nombreBuscado}%` 
                }
            }
        });

        res.send(pokemones);
    } catch (error) {
        console.error("Error en getPokemonByName:", error);
        return res.status(500).send({ message: 'Error al obtener los pokemones' });
    }
};

exports.getPokemonById = async (req, res) => {
    const { id } = req.params;
    try {
        const pokemon = await db.pokemon.findByPk(id);
        if (!pokemon) {
            return res.status(404).send({ message: 'Pokemon no encontrado' });
        }
        res.send(pokemon);
    } catch (error) {
        console.error("Error al obtener el pokemon:", error);
        return res.status(500).send({ message: 'Error al obtener el pokemon' });
    }
};

exports.deletePokemon = async (req, res) => {
    const { id } = req.params;

    try {
        const pokemon = await db.pokemon.findByPk(id);

        if (!pokemon) {
            return res.status(404).send({ message: "pokemon no encontrado" });
        }

        await pokemon.destroy();
        res.send({ message: "pokemon eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar pokemon:", error);
        res.status(500).send({ message: "Error al pokemon el movimiento" });
    }
};

exports.updatePokemon = async (req, res) => {
    const { id } = req.params;
    const { nombre, hp, attack, defense, spAtk, spDef, speed, tipoId } = req.body;

    try {
        const pokemon = await db.pokemon.findByPk(id);

        if (!pokemon) {
            return res.status(404).send({ message: "Pokémon no encontrado" });
        }

        pokemon.nombre = nombre || pokemon.nombre;
        pokemon.hp = hp ?? pokemon.hp;
        pokemon.attack = attack ?? pokemon.attack;
        pokemon.defense = defense ?? pokemon.defense;
        pokemon.spAtk = spAtk ?? pokemon.spAtk;
        pokemon.spDef = spDef ?? pokemon.spDef;
        pokemon.speed = speed ?? pokemon.speed;
        pokemon.tipoId = tipoId ?? pokemon.tipoId;

        await pokemon.save();

        res.send({ message: "Pokémon actualizado correctamente" });
    } catch (error) {
        console.error("Error al actualizar Pokémon:", error);
        res.status(500).send({ message: "Error al actualizar el Pokémon" });
    }
};
