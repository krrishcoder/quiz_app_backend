const express = require('express');
const router = express.Router();
const Score = require('../models/Score'); // Adjust path if needed

// GET scores by userId
router.get('/api/scores', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId in query" });
    }

    const scores = await Score.find({ userId }).sort({ datetime: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

module.exports = router;