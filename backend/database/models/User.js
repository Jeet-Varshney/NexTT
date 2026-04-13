const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  rollNo: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  branch: { type: String },
  section: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['Student', 'Admin', 'Super Admin'], default: 'Student' },
  permissions: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
