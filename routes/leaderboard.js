const express = require('express');
const router = express.Router();
const Score = require('../models/Score'); // Adjust path if needed
const User = require('../models/User'); // Adjust path if needed

// GET leaderboard data
router.get('/api/leaderboard', async (req, res) => {
  console.log("Leaderboard request received"); // Debug log

  try {
    const leaderboard = await Score.aggregate([
      {
        $group: {
          _id: { topic: "$topic", userId: "$userId" },
          averageScore: { $avg: "$score" }, // Calculate average score
          date: { $max: "$datetime" } // Get the latest date for the score
        }
      },
      {
        $lookup: {
          from: User.collection.name, // Assuming you have a users collection
          localField: '_id.userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      {
        $unwind: "$userInfo"
      },
      {
        $project: {
          topic: "$_id.topic",
          user: { $concat: ["$userInfo.name", " (", { $toString: "$userInfo.email" }, ")"] },
          score: { $round: ["$averageScore", 2] }, // Round the average score to 2 decimal places
          date: "$date"
        }
      },
      { $sort: { score: -1 } } // Sort by average score descending
    ]);

    console.log("Leaderboard data fetched successfully", leaderboard); // Debug log
    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});

module.exports = router;
