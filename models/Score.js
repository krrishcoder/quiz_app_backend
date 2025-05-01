const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referencing the User model
    required: true,
  },
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  datetime: {
    type: Date,
    default: Date.now,
  }
}, { collection: 'score' }); // Use 'results' collection

module.exports = mongoose.model('Score', scoreSchema);
