const express = require('express');
const router = express.Router();;

const Producto = require('../models/productos');

router.get('/productos', async (req, res) => {
    const productos = await Producto.find();
    res.json(productos);
});

router.post('/productos', async (req, res) => {
    const { nombre, precio, stock } = req.body;
    const producto = new Producto({nombre, precio, stock});
    await producto.save();
    res.json({status: 'guardado'});
});
router.get('/productos/:id', async (req, res) => {
    const productos = await Producto.findById(req.params.id);
    res.json(productos);
});
module.exports = router;
