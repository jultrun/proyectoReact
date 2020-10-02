const mongoose = require('mongoose');
const { Schema } = mongoose;

const Producto = new Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
});

module.exports = mongoose.model('Producto', Producto);