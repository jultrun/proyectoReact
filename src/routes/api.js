const express = require('express');
const router = express.Router();;

const Productos = require('../models/productos');

router.get('/productos', async (req, res) => {
    const productos = await Productos.find();
    res.json(productos);
});

module.exports = router;
