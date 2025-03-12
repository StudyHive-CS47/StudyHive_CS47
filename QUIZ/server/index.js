const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const socketHandler = require('./socketHandler');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5190", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Initialize socket handler
socketHandler(io);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 