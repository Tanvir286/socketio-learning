// server.js
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const port = 4000;

// static files (public folder)
app.use(express.static(path.join(__dirname, 'public')));

// index.html serve
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
 
// http server create
const server = http.createServer(app);
// socket.io attach
const io = new Server(server);

// socket.io events
io.on('connection', (socket) => {
  console.log('✅ A user connected', socket.id);

  socket.emit('welcome', `Hi ${socket.id}, welcome to the server!`);

  
  socket.emit('server message', 'item 1', 'item 2', 'item 3');
  
  socket.emit('server message2', 'Hello', 42, { item1: 'product1', item2: 'product2' });
 
  socket.on('client message', (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);
  });

});

// server listen
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
