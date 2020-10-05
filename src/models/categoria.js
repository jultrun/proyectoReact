const mongoose = require('mongoose');
const { Schema } = mongoose;

const Categoria = new Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  creador : { type: Schema.Types.ObjectId, ref: 'Usuario' },
});

module.exports = mongoose.model('Categoria', Categoria);