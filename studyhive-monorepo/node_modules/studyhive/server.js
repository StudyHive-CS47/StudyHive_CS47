const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5190", // Adjust this to your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

const quizzes = []; // Store quizzes
const leaderboard = new Map(); // Store leaderboard data in memory
const recentAttempts = []; // Store recent attempts
const searchHistory = []; // Store search history
const createdQuizzes = []; // Store created quizzes

// Create New Quiz
app.post('/quizzes', (req, res) => {
  const { title, description, questions, creator } = req.body;
  const newQuiz = { id: quizzes.length + 1, title, description, questions, creator };
  quizzes.push(newQuiz);
  res.status(201).json(newQuiz);
});

// Get All Quizzes
app.get('/quizzes', (req, res) => {
  res.json(quizzes);
});

// Search Quizzes
app.get('/quizzes/search', (req, res) => {
  const { subject, creator } = req.query;
  const results = quizzes.filter(quiz => 
    (subject ? quiz.questions.some(q => q.subject === subject) : true) &&
    (creator ? quiz.creator.toLowerCase().includes(creator.toLowerCase()) : true)
  );
  res.json(results);
});

// Handle Quiz Completion
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('quizCompleted', (data) => {
    const { userId, name, score } = data;

    // Update leaderboard
    leaderboard.set(userId, {
      id: userId,
      name,
      score: (leaderboard.get(userId)?.score || 0) + score,
      lastUpdated: new Date()
    });

    // Save recent attempt
    recentAttempts.push({
      quizTitle: data.quizTitle,
      score,
      dateTaken: new Date()
    });

    // Save search history
    searchHistory.push({
      searchTerm: data.searchTerm,
      quizCreator: name,
      date: new Date(),
      attempted: true
    });

    // Broadcast updated leaderboard to all clients
    const leaderboardArray = Array.from(leaderboard.values())
      .sort((a, b) => b.score - a.score);
    io.emit('leaderboardUpdate', leaderboardArray);
  });

  // Handle initial leaderboard request
  socket.on('getLeaderboard', () => {
    const leaderboardArray = Array.from(leaderboard.values())
      .sort((a, b) => b.score - a.score);
    socket.emit('leaderboardUpdate', leaderboardArray);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 