const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 4000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const server = http.createServer(app);
const io = new Server(server);

// Connection
io.on('connection', (socket) => {
  console.log('New user connected');

  // Global message
  socket.on('send message', (msg) => {
    io.emit('send message', msg);
  });

  // Room message
  socket.on('send room message', (msg) => {
    io.to(msg.room).emit('send room message', msg);
  });

  // Join room
  socket.on('join room request', (room) => {
    socket.join(room);
    socket.emit('join room success', `You joined room: ${room}`, room);
    socket.to(room).emit('send room message', {
      user: 'System',
      text: `A New user has joined the room: ${room}`,
      room,
    });
  });

  // Leave room
  socket.on('leave room request', (room) => {
    socket.leave(room);
    socket.emit('leave room success', `You left room: ${room}`);
    socket.to(room).emit('send room message', {
      user: 'System',
      text: `A User has left the room: ${room}`,
      room,
    });
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
