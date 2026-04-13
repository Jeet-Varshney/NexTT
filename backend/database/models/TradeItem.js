const mongoose = require('mongoose');

const tradeItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  negotiable: { type: Boolean, default: false },
  imageUrl: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Books', 'Notes/Modules', 'Instruments', 'Stationary', 'Electronics', 'Other'], 
    required: true 
  },
  status: { type: String, enum: ['active', 'sold'], default: 'active' },
  sellerId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TradeItem', tradeItemSchema);
