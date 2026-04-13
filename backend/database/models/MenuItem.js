const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, enum: ['Snacks', 'Meals', 'Beverages', 'Combos'], required: true },
  prepTime: { type: Number, required: true }, // in minutes
  emoji: { type: String, default: '🍽️' },
  isAvailable: { type: Boolean, default: true },
  tags: [String] // e.g. ['veg', 'spicy']
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
