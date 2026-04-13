const mongoose = require('mongoose');

const tradeMessageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'TradeItem', required: true },
  messageText: { type: String, default: '' },
  offerPrice: { type: Number },
  status: { type: String, enum: ['sent', 'read', 'accepted', 'rejected'], default: 'sent' }
}, { timestamps: true });

module.exports = mongoose.model('TradeMessage', tradeMessageSchema);
