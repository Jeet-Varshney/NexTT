const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  prepTime: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [orderItemSchema],
  orderType: { type: String, enum: ['Delivery', 'Pickup'], required: true },
  deliveryAddress: { type: String, default: '' },
  totalAmount: { type: Number, required: true },
  totalPrepTime: { type: Number, required: true }, // max of all item prepTimes
  status: {
    type: String,
    enum: ['Pending', 'Preparing', 'Ready', 'OutForDelivery', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: { type: String, enum: ['UPI', 'Card', 'Cash'], default: 'Cash' },
  isCancelled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
