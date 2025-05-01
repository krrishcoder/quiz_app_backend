const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  }
}, { collection: 'user' }); // Explicitly specify collection name as 'users'

module.exports = mongoose.model('User', userSchema);
