const socket = io();

const form = document.getElementById('chat-form');
const input = document.getElementById('msg');
const messages = document.getElementById('messages');
const fileInput = document.getElementById('file');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const message = input.value.trim();
  const file = fileInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    await fetch('/upload', {
      method: 'POST',
      body: formData
    });

    fileInput.value = ''; // Clear file input
  }

  if (message) {
    socket.emit('chat message', message);
    input.value = '';
  }
});

// Receive text message
socket.on('chat message', (msg) => {
  const li = document.createElement('li');
  li.textContent = msg;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

// Receive image
socket.on('chat image', (imgPath) => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = imgPath;
    img.className = 'chat-image';
    li.appendChild(img);
    messages.appendChild(li);
    messages.scrollTop = messages.scrollHeight;
  });