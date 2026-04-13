const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  category: { type: String, required: true }
});

const nexKitOrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [orderItemSchema],
  orderType: { type: String, enum: ['Delivery', 'Pickup'], required: true },
  deliveryAddress: { type: String, default: '' },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Processing', 'Ready', 'Delivered', 'Cancelled'], default: 'Pending' },
  isCancelled: { type: Boolean, default: false },
  cancelledAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('NexKitOrder', nexKitOrderSchema);
