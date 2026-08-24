const http = require('http');
const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { handleAnnouncement } = require('./controllers/messageController');

dotenv.config();

function createServer() {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  app.set('io', io);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('joinEventRoom', ({ eventId }) => {
      if (eventId) {
        socket.join(String(eventId));
        socket.emit('joinedEventRoom', { eventId: String(eventId) });
      }
    });

    socket.on('announceToEvent', async (payload) => {
      await handleAnnouncement(io, socket, payload);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return server;
}

async function startServer() {
  const server = createServer();
  const port = process.env.PORT || 5000;

  try {
    await connectDB();
    return await new Promise((resolve) => {
      const httpServer = server.listen(port, () => {
        console.log(`Server running on port ${port}`);
        resolve(httpServer);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    throw error;
  }
}

if (require.main === module) {
  startServer().catch((error) => {
    process.exit(1);
  });
}

module.exports = { app, createServer, startServer };
