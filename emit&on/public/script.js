// client side
const socket = io(); // automatically connect to same host:port

socket.on('welcome', (msg) => {
  console.log(msg);
});

socket.on('server message', (item1, item2, item3) => {
  console.log('Server message:', item1, item2, item3);
})

socket.on('server message2', (message) => {
  const [greeting, number, obj] = message;
  console.log('Server message2:', greeting, number, obj);
});

// send message to server
socket.emit('client message', 'Hello from client!'); 