// client side
const socket = io(); // automatically connect to same host:port

const chatBoxE1 = document.getElementById('chat-box');


socket.on('new user', (msg) => {
  const pE1 = document.createElement('p');
  pE1.textContent = msg;
  pE1.style.fontStyle = 'italic';
  chatBoxE1.appendChild(pE1);
});


socket.on('send message', (msg) => {
  const pE1 = document.createElement('p');
  pE1.textContent = `${msg.user}: ${msg.text}`;
  chatBoxE1.appendChild(pE1);
});


let sendMessage = () => {
  
  const user = document.getElementById('user').value;
  const text = document.getElementById('text').value;

  socket.emit('send message', { user, text });
  document.getElementById('text').value = '';
}