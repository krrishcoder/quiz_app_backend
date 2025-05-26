const express = require('express');
const router = express.Router();
const util = require('util');
const mongoose = require('mongoose');
const QuizResult = require('../models/QuizResult'); // Adjust the path if needed

router.post('/api/save-responses', async (req, res) => {
  console.log(util.inspect(req.body, { showHidden: false, depth: null, colors: true }));

  try {
    const { userId, topic, difficulty, questions, score, totalQuestions } = req.body;

    // Validate ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
         console.log("Invalid userId:", userId);
      return res.status(400).json({ message: 'Invalid or missing userId.' });
    }

    // Validate top-level fields
    if (
      typeof topic !== 'string' ||
      typeof difficulty !== 'string' ||
      !Array.isArray(questions) ||
      typeof score !== 'number' ||
      typeof totalQuestions !== 'number'
    ) {
        console.log("Invalid data types in request body:", {
          topic,
          difficulty,
          questions,
          score,
          totalQuestions
        });
      return res.status(400).json({ message: 'Invalid data types in request body.' });
    }

    // Validate difficulty enum
    const allowedDifficulties = ['easy', 'medium', 'hard'];
    if (!allowedDifficulties.includes(difficulty)) {

        console.log("Invalid difficulty level:", difficulty);
      return res.status(400).json({ message: 'Invalid difficulty level.' });
    }

    // Validate questions array
        for (let q of questions) {
        if (
            typeof q.question !== 'string' || q.question.trim() === '' ||
            !Array.isArray(q.options) || q.options.length === 0 ||
            (q.selected !== null && (typeof q.selected !== 'string' || q.selected.trim() === ''))
        ) {
            console.log("Invalid question format:", q);
            return res.status(400).json({ message: 'Invalid question format.' });
        }
        }




    // Create and save document
    const quizResult = new QuizResult({
      userId: new mongoose.Types.ObjectId(userId),
      topic: topic.trim(),
      difficulty,
      questions,
      score,
      totalQuestions
    });


    console.log('Saving quiz result:', quizResult);

    const savedResult = await quizResult.save();

    res.status(201).json({
      message: 'Quiz result saved successfully.',
      result: savedResult
    });

  } catch (err) {
    console.error('Error saving quiz result:', err.message || err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
