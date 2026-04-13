const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facilityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Facility', required: true },
  targetStartTime: { type: Date },
  status: { type: String, enum: ['Waiting', 'Notified', 'Expired'], default: 'Waiting' }
}, { timestamps: true });

module.exports = mongoose.model('Waitlist', waitlistSchema);
