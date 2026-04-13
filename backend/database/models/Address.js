const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  label: { type: String, default: 'Home' }, // e.g. "Hostel Block B", "Classroom 3F"
  details: { type: String, required: true }, // Full address string
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
