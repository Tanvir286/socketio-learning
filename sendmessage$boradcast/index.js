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
  
  // if you want to send message to all clients except sender, use:
  socket.broadcast.emit('new user', 'A new user has joined '); 

  // receive message from client  
  socket.on('send message', (msg) => {

    /* sudu nije message nije dakte parbe */
    socket.emit('send message2', msg); 
 
    /* sobai message pabe */
    io.emit('send message', msg); 

  }); 

});

// server listen
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
