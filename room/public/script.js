const socket = io();

const chatBox = document.getElementById('chat-box');
const chatRoomName = document.getElementById('chat-roomName');
const roomInput = document.getElementById('room');

//----------------- Receive messages -----------------//
socket.on('send message', (msg) => {
  addMessage(`${msg.user}: ${msg.text}`);
});

socket.on('send room message', (msg) => {
  addMessage(`${msg.user}: ${msg.text}`);
});

socket.on('join room success', (msg, room) => {
  chatRoomName.textContent = `Chat Room: ${room}`;
  addMessage(msg, true);
});

socket.on('leave room success', (msg) => {
  chatRoomName.textContent = `Global Chat`;
  addMessage(msg, true);
});

//----------------- Send message -----------------//
function sendMessage() {
  const user = document.getElementById('user').value || 'Anonymous';
  const text = document.getElementById('text').value;
  const room = roomInput.value;

  if (!text) return;

  if (chatRoomName.textContent.includes('Chat Room') && room) {
    socket.emit('send room message', { user, text, room });
  } else {
    socket.emit('send message', { user, text });
  }

  document.getElementById('text').value = '';
}

//----------------- Join/Leave room -----------------//
function joinRoom() {
  const room = roomInput.value;
  if (!room) return alert('Enter a room name');
  socket.emit('join room request', room);
}

function leaveRoom() {
  const room = roomInput.value;
  if (!room) return alert('You are not in a room');
  socket.emit('leave room request', room);
}

//----------------- Utility -----------------//
function addMessage(message, isItalic = false) {
  const p = document.createElement('p');
  p.textContent = message;
  if (isItalic) p.classList.add('italic');
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}
