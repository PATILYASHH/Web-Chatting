// script.js
const socket = io();
const messageInput = document.getElementById('message');
const messagesDiv = document.getElementById('messages');
const sendBtn = document.getElementById('send-btn');
const emojiBtn = document.getElementById('emoji-btn');
const attachmentBtn = document.getElementById('attachment-btn');
const fileInput = document.getElementById('file-input');
let username = localStorage.getItem('username') || prompt('Enter your name');

// Store the username in localStorage if not present
if (!localStorage.getItem('username')) {
  localStorage.setItem('username', username);
}

// Handle sending message
sendBtn.addEventListener('click', () => {
  const msg = messageInput.value.trim();
  if (msg) {
    socket.emit('chat message', { msg, username });
    messageInput.value = '';
  }
});

// Handle receiving message
socket.on('chat message', (data) => {
  const { msg, username: sender } = data;
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender === username ? 'sent' : 'received');
  messageDiv.innerHTML = `<p>${msg}</p><small>${sender}</small>`;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Emoji Picker
const picker = new EmojiButton();
emojiBtn.addEventListener('click', () => {
  picker.togglePicker(emojiBtn);
});
picker.on('emoji', emoji => {
  messageInput.value += emoji;
});

// File Attachments
attachmentBtn.addEventListener('click', () => {
  fileInput.click();
});
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    socket.emit('file upload', { file, username });
  }
});

// Settings - Change Username
document.getElementById('settings-btn').addEventListener('click', () => {
  $('#usernameModal').modal('show');
});
document.getElementById('save-username-btn').addEventListener('click', () => {
  const newUsername = document.getElementById('new-username').value.trim();
  if (newUsername) {
    localStorage.setItem('username', newUsername);
    username = newUsername;
    $('#usernameModal').modal('hide');
  }
});

// Search Functionality
document.getElementById('search-input').addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const messages = messagesDiv.querySelectorAll('.message');
  messages.forEach(message => {
    const text = message.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      message.style.display = '';
    } else {
      message.style.display = 'none';
    }
  });
});