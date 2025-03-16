const leaderboard = new Map(); // Store leaderboard data in memory

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected');

    // Handle initial leaderboard request
    socket.on('getLeaderboard', () => {
      const leaderboardArray = Array.from(leaderboard.values())
        .sort((a, b) => b.score - a.score);
      socket.emit('leaderboardUpdate', leaderboardArray);
    });

    // Handle quiz completion
    socket.on('quizCompleted', (data) => {
      const { userId, name, score } = data;
      
      // Update leaderboard
      leaderboard.set(userId, {
        id: userId,
        name,
        score: (leaderboard.get(userId)?.score || 0) + score,
        lastUpdated: new Date()
      });

      // Broadcast updated leaderboard to all clients
      const leaderboardArray = Array.from(leaderboard.values())
        .sort((a, b) => b.score - a.score);
      io.emit('leaderboardUpdate', leaderboardArray);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
}; 