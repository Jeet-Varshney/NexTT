const mongoose = require('mongoose');

const kitItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, enum: ['Stationary', 'Academic Supplies', 'Lab Items'], required: true },
  imageUrl: { type: String, default: '' },
  emoji: { type: String, default: '✏️' },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('KitItem', kitItemSchema);
