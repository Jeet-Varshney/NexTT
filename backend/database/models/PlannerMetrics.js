const mongoose = require('mongoose');

const plannerMetricsSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  attendance: [
    {
      subject: String,
      attended: Number,
      total: Number
    }
  ],
  studyStreaks: [
    {
      date: String, // 'YYYY-MM-DD'
      hours: Number
    }
  ]
}, { timestamps: true, bufferCommands: false });

module.exports = mongoose.model('PlannerMetrics', plannerMetricsSchema);
