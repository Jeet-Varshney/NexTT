const mongoose = require('mongoose');

const printJobSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  mimeType: { type: String, required: true },
  pages: { type: String, required: true },
  copies: { type: Number, required: true, min: 1 },
  color: { type: Boolean, default: false },
  cost: { type: Number, required: true },
  orderType: { type: String, enum: ['Delivery', 'Pickup'], required: true },
  deliveryAddress: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Processing', 'Printing', 'Ready', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  uploadPath: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('PrintJob', printJobSchema);
