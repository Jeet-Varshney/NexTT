const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We attempt to connect to localhost DB. For prod, use Atlas URI.
    const URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/next_smart_campus';
    await mongoose.connect(URI);
    console.log(`Connected to Database at ${URI}`);
  } catch (err) {
    console.error('Database connection error:', err);
    // Since we want this demo to run even without a real local Mongo instance, 
    // we just warn rather than immediately crash process.exit(1)
  }
};

module.exports = connectDB;
