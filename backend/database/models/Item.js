const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  stock: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
