const mongoose = require('mongoose');

const extracurricularSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  activityName: { type: String, required: true },
  type: { type: String, enum: ['Event', 'Club', 'Hackathon'] },
  badgeGiven: { type: Boolean, default: false },
  date: { type: String }
}, { timestamps: true, bufferCommands: false });

module.exports = mongoose.model('Extracurricular', extracurricularSchema);
