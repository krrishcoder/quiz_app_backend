const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [arr => arr.length > 0, 'Options array cannot be empty'],
  },
selected: {
  type: String,
  trim: true,
  required: false,       // allow omission
  default: null,         // support null
},

  answer: {
    type: String,
    required: true,
    trim: true,
  }


});

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
  },
  questions: {
    type: [questionSchema],
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 0,
  },
  datetime: {
    type: Date,
    default: Date.now,
  }
}, { collection: 'quiz_results' });

module.exports = mongoose.model('QuizResult', quizResultSchema);
