const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const User = require('./models/User');
const QuizResult = require('./models/QuizResult'); // Adjust the path as necessary

const axios = require('axios');
const submitRoute = require('./routes/submit');
const scoreRoutes = require('./routes/results');
const saveResultRoute = require('./routes/save_result'); // Adjust the path as necessary
const util = require('util');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json





mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));




//Route to create a user  SIGNUP
app.post("/api/signup", async (req, res) => {
  const { name, email, password, course } = req.body;

  console.log("Received signup request:", req.body); // ✅ Debug log

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists:", email);
      return res.json({ success: false, message: "User already exists" });
    }

    const newUser = new User({ name, email, password, course });
    await newUser.save();

    console.log("user: ", newUser);
    

    console.log("User created successfully:", newUser);
    res.json({ success: true , newUser});
  } catch (err) {
    console.error("Signup error:", err); // ✅ Critical error log
    res.json({ success: false });
  }
});


//login
app.post("/api/login", async (req, res) => {
    const { identifier, password } = req.body;
  
    try {
      const user = await User.findOne({
        $or: [{ email: identifier }, { name: identifier }],
      });

      console.log("Login attempt:", { identifier, password });
     console.log("User found:", user);
  
      if (!user || user.password !== password) {
        return res.json({ success: false }); // Login failed
      }

     res.json({ success: true, user });    // Login successful
 

    } catch (error) {
      console.error(error);
      res.json({ success: false }); // Error handling
    }
  });
  



// // Get all users
app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find(); // Fetch all users from the DB
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: 'Server error while fetching users' });
    }
  });
 
// api for quiz 







require('dotenv').config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(express.json());

app.get('/api/ask-ai', async (req, res) => {


  try {
  
  const { difficulty, topic } = req.query;
  console.log('Difficulty:', difficulty);
  console.log('Topic:', topic);


   const userPrompt = `create 10 ${difficulty} mcq questions for ${topic} in C Language" with 4 options and answer for each question, give in json so that i can easily integrate this with my app.`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: userPrompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const reply = response.data;
    console.log('API response:', reply);
    const questionText = reply.candidates[0].content.parts[0].text;

    const cleanedText = questionText
    .replace(/^\s*```json\s*/, '')  // Remove ```json at the start
    .replace(/\s*```$/, '')         // Remove ``` at the end
  
    
    console.log(' questionText',cleanedText);

 
    const questions = JSON.parse(cleanedText); // Convert string to JSON
    res.json(questions); // Send as response

    
  
 

    

  } catch (error) {
    console.error('API call failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch response from Gemini API' });
  }
});




// api for store and retrive score 





// for login
app.post("/login", async (req, res) => {
  console.log("Login request received:"); // Debug log
    const { identifier, password } = req.body;
    try {
      const user = await User.findOne({
        $or: [{ email: identifier }, { name: identifier }],
      });
  
      if (!user || user.password !== password) {
        return res.json({ success: false });
      }
  
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.json({ success: false });
    }
  });
  
  // Optional: Serve dashboard
  app.get("/dashboard.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dashboard.html")); // Create this later
  });


// SUBMIT SCORE
app.use(submitRoute);


// SCORES
app.use(scoreRoutes);

// Save Quiz Responses
app.use(saveResultRoute); // Adjust the path as necessary



//======================================================  
const QuizResponse = require('./models/QuizResponse'); // Adjust the path as necessary



//======================================================
app.get('/', async (req, res) => {  

  res.send({"message": "Welcome to the Quiz API!"});

})

//-----------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
