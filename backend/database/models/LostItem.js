const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  imageUrl:    { type: String, required: true },   // base64 data URL or path
  location:    { type: String, required: true, trim: true },
  type:        { type: String, enum: ['lost', 'found'], default: 'lost' },
  status:      { type: String, enum: ['active', 'claimed', 'resolved'], default: 'active' },
  userId:      { type: String, required: true },   // username / roll no
  userDisplay: { type: String, default: 'Anonymous' },
  date:        { type: String, default: '' },       // optional free-text date
  tags:        [String],
}, { timestamps: true });

module.exports = mongoose.model('LostItem', lostItemSchema);
