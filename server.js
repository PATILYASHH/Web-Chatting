// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let users = 0;

io.on('connection', (socket) => {
  users++;
  io.emit('user connected', users);

  socket.on('chat message', (data) => {
    const { msg, username } = data;
    const timestamp = new Date().toLocaleTimeString();
    io.emit('chat message', { msg, username, timestamp });
  });

  socket.on('typing', (username) => {
    socket.broadcast.emit('typing', username);
  });

  socket.on('disconnect', () => {
    users--;
    io.emit('user disconnected', users);
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});