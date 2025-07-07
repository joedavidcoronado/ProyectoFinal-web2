const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

module.exports = app => {
    const router = express.Router();

    function ensureDirExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }

    const createStorage = (tipo, subfolderCallback = null) => multer.diskStorage({
        destination: (req, file, cb) => {
            let uploadPath;
            try {
                const subfolder = subfolderCallback ? subfolderCallback(req) : "";
                if (subfolder && typeof subfolder === "string") {
                    uploadPath = path.join(__dirname, "..", "uploads", tipo, subfolder);
                } else {
                    uploadPath = path.join(__dirname, "..", "uploads", tipo);
                }
            } catch (e) {
                uploadPath = path.join(__dirname, "..", "uploads", tipo);
            }

            ensureDirExists(uploadPath);
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            const id = req.params.id;
            cb(null, `${id}.png`);
        }
    });

    const uploadPokemon = multer({ storage: createStorage("pokemon") });
    const uploadItem = multer({ storage: createStorage("item") });

    const uploadTipo = multer({
        storage: createStorage("tipo", req => {
            const tipo = req.body?.tipo?.trim();
            return tipo || null;
        })
    });

    router.post("/upload/pokemon/:id", uploadPokemon.single("imagen"), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo" });
        }
        res.json({ mensaje: "Imagen de Pokémon subida correctamente", file: req.file });
    });

    router.post("/upload/item/:id", uploadItem.single("imagen"), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo" });
        }
        res.json({ mensaje: "Imagen de Item subida correctamente", file: req.file });
    });

    router.post("/upload/tipo/:id", uploadTipo.single("imagen"), (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "No se subió ningún archivo" });
        }
        const tipo = req.body?.tipo;
        const mensaje = tipo
            ? `Imagen guardada correctamente en carpeta tipo/${tipo}`
            : "Imagen guardada en carpeta tipo/";
        res.json({ mensaje, file: req.file });
    });

    router.get("/:tipo/:filename", (req, res) => {
        const { tipo, filename } = req.params;
        const filePath = path.join(__dirname, "..", "uploads", tipo, filename);

        if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
        } else {
            res.status(404).json({ error: "Imagen no encontrada" });
        }
    });

    app.use("/imagen", router);
};
