const express = require("express");
const router = express.Router();
const Categoria = require("../models/categoria.js");

router.post("/categoria", (req, res) => {
    const categoria = Categoria(req.body);
    categoria.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.get("/categoria", (req, res) => {
    Categoria.find()
        .then((data) => res.json(data)) 
        .catch((error) => res.json({ message: error }));
});

router.get("/categoria/:id", (req, res) => {
    const { id } = req.params;
    Categoria.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.put("/categoria/:id", (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    Categoria.updateOne({ _id: id }, {
            $set: { nombre }})
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.delete("/categoria/:id", (req, res) => {
    const { id } = req.params;
    Categoria.findByIdAndDelete(id)
        .then((data) => {res.json(data);})
        .catch((error) => {res.json({ message: error });});
});

router.get("/categoria/nombre/:nombre", (req, res) => {
    const { nombre } = req.params;
    Categoria.findOne({ nombre: nombre })
        .then((data) => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).json({ message: "Categoría no encontrada" });
            }
        })
        .catch((error) => res.status(500).json({ message: error }));
});


module.exports = router;