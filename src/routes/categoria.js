const express = require("express");
const router = express.Router();
const categoriaSchema = require("../models/categoria.js");

router.post("/categoria", (req, res) => {
    const categoria = preguntasSchema(req.body);
    categoria.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/categoria", (req, res) => {
    categoriaSchema.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/categoria/:id", (req, res) => {
    const { id } = req.params;
    categoriaSchema.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

