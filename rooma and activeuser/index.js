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

const usersOnline = new Set();

// যখন কেউ সংযোগ করে
io.on('connection', (socket) => {

  // নতুন ব্যবহারকারী যোগ
  socket.on('new user', (user) => {
    socket.username = user;
    usersOnline.add(user);
    io.emit('users online', Array.from(usersOnline));
  });

  // ব্যবহারকারী ডিসকানেক্ট হলে
  socket.on('disconnect', () => {
    if (socket.username) {
      usersOnline.delete(socket.username);
      io.emit('users online', Array.from(usersOnline));
    }
  });

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
    socket.emit('join room success', `আপনি রুমে যোগ দিয়েছেন: ${room}`, room);
    socket.to(room).emit('send room message', {
      user: 'System',
      text: `একজন ব্যবহারকারী রুমে যোগ দিয়েছে: ${room}`,
      room,
    });
  });

  // Leave room
  socket.on('leave room request', (room) => {
    socket.leave(room);
    socket.emit('leave room success', `আপনি রুম ছেড়েছেন: ${room}`);
    socket.to(room).emit('send room message', {
      user: 'System',
      text: `একজন ব্যবহারকারী রুম থেকে বের হয়েছে: ${room}`,
      room,
    });
  });

});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
