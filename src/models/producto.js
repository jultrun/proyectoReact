const mongoose = require('mongoose');
const { Schema } = mongoose;

const Producto = new Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true },
  creador : { type: Schema.Types.ObjectId, ref: 'Usuario' },
});

module.exports = mongoose.model('Producto', Producto);