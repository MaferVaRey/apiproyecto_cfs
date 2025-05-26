const express = require("express");
const router = express.Router();
const categoriaSchema = require("../models/categoria.js");

router.post("/categoria", (req, res) => {
    const categoria = categoriaSchema(req.body);
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

router.put("/categoria/:id", (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    categoriaSchema.updateOne({ _id: id }, {
            $set: { nombre }})
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
});

router.delete("/categoria/:id", (req, res) => {
    const { id } = req.params;
    categoriaSchema.findByIdAndDelete(id)
        .then((data) => {res.json(data);})
        .catch((error) => {res.json({ message: error });});
});

router.get("/categoria/nombre/:nombre", (req, res) => {
    const { nombre } = req.params;
    categoriaSchema.findOne({ nombre: nombre })
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