const mongoose = require('mongoose');

const plannerTaskSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  category: { type: String, default: 'Core', enum: ['Core', 'Personal', 'Urgent', 'Lab'] },
  date: { type: String } // 'YYYY-MM-DD'
}, { timestamps: true, bufferCommands: false });

module.exports = mongoose.model('PlannerTask', plannerTaskSchema);
