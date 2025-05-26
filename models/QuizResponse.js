const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User ' // Reference to the User model
  },
  responses: {
    type: Map,
    of: new mongoose.Schema({
      selected: {
        type: String,
        required: false, // Selected answer can be null if not attempted
      },
      attempted: {
        type: Boolean,
        required: true,
      }
    }),
    required: true,
  },
  score: {
    type: Number,
    required: true,
    default: 0,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { collection: 'quizResponses' }); // Explicitly specify collection name as 'quizResponses'

module.exports = mongoose.model('QuizResponse', responseSchema);
