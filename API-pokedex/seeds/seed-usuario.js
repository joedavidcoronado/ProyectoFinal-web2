const { sequelize } = require("../config/db.config");
const db = require("../models"); 

const usuario =
    {   "nombre": "Mihdi Ugarte" ,
        "correo": "m@gmail.com",
        "contraseña": "123",
        "tipo": "admin"
    };

async function seedUsuarios() {
    try {
        console.log("Conectado a la base de datos.");

        await db.usuario.create(usuario);
        console.log(`Usuario creado: ${usuario}`);
    } catch (error) {
        console.error("Error al insertar usuario:", error);
    } finally {
        await sequelize.close();
    }
}

async function seedGetUsuarios(){
    try {
        const usuarios = await db.usuario.findAll();
        usuarios.forEach(usuario => {
            console.log(`Usuario: ${usuario.nombre} ID: ${usuario.id} correo ${usuario.correo} tipo: ${usuario.tipo}`);
        });
    } catch (error) {
        console.error("Error al insertar usuario:", error);
    } finally {
        await sequelize.close();
    }
}

//seedUsuarios();
seedGetUsuarios();
