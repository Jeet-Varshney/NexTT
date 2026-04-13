const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  emoji: { type: String, default: '📦' }
});

const printDetailsSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileUrl: { type: String }, // optional, mock representation
  colorType: { type: String, enum: ['B/W', 'Color'], required: true },
  copies: { type: Number, required: true, min: 1 },
  pageSelection: { type: String, default: 'All' }, // e.g. "All", "1-5", "1,3,5"
  pagesCount: { type: Number, required: true, min: 1 }
});

const kitOrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ['Stationary', 'PrintJob'], required: true },
  items: [orderItemSchema], // Populated if type is Stationary
  printDetails: printDetailsSchema, // Populated if type is PrintJob
  deliveryMethod: { type: String, enum: ['Delivery', 'Pickup'], required: true },
  deliveryAddress: { type: String, default: '' },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Printing', 'Ready', 'OutForDelivery', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: { type: String, enum: ['UPI', 'Card', 'Cash'], default: 'Cash' },
  isCancelled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('KitOrder', kitOrderSchema);
