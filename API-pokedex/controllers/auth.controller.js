const db = require("../models/");
const { generateAuthToken, generatePassword } = require("../utils/auth.utils");

exports.login = async (req, res) => {
    const { correo, contraseña } = req.body;
    if (!correo || !contraseña) {
        return res.status(400).send({ message: "El usuario y la contraseña son requeridas" });
    }
    const usuario = await db.usuario.findOne({
        where: {
            correo: correo,
        },
    });
    if (!usuario) {
        return res.status(401).send({ message: "Usuario o contraseña incorrectos" });
    }
    const hashedPassword = generatePassword(contraseña);
    if (usuario.contraseña !== hashedPassword) {
        return res.status(401).send({ message: "Usuario o contraseña incorrectos" });
    }
    console.log("usuario verificado");
    try {
        const authToken = await db.authToken.create({
            usuarioId: usuario.id,
            token: generateAuthToken(usuario.correo),
        });
        console.log("authToken", authToken);

        res.send({
            token: authToken.token,
        });
    } catch (error) {
        console.error("Error creating auth token:", error);
        return res.status(500).send({ message: "Error al crear el token de autenticación" });
    }

};

exports.register = async (req, res) => {
    const { nombre, correo, contraseña } = req.body;
    if (!correo || !contraseña || !nombre) {
        return res.status(400).send({ message: "El usuario y la contraseña son requeridas" });
    }
    const existingUser = await db.usuario.findOne({
        where: {
            correo: correo,
        },
    });
    if (existingUser) {
        return res.status(400).send({ message: "El correo ya existe" });
    }
    const hashedPassword = generatePassword(contraseña);
    console.log("hashedPassword", hashedPassword);
    console.log("correo", correo);
    try {
        const usuario = await db.usuario.create({
            nombre: req.body.nombre,
            correo: correo,
            contraseña: hashedPassword,
        });
        res.send({
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            tipo: usuario.tipo,
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).send({ message: "Error al crear usuario" });
    }

}

exports.me = async (req, res) => {
    const usuario = res.locals.usuario;

    res.send({
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        tipo: usuario.tipo
    });
}
