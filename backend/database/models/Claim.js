const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  itemId:       { type: mongoose.Schema.Types.ObjectId, ref: 'LostItem', required: true },
  claimantId:   { type: String, required: true },           // username / roll no
  claimantName: { type: String, default: 'Anonymous' },
  proof:        { type: String, required: true },           // text description
  proofImageUrl:{ type: String, default: '' },              // optional extra image
  status:       { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  message:      { type: String, default: '' },              // optional note from owner
}, { timestamps: true });

module.exports = mongoose.model('Claim', claimSchema);
