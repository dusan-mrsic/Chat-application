const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
const users = {}
let onlineUsers = []

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


io.on('connection', socket => {
  socket.on('new-user', name => {
    users[name] = socket.id
    onlineUsers.push(name)
    io.emit('user-connected', onlineUsers)
  })
  socket.on('send-chat-message', (message, username) => {
    socket.broadcast.to(users[username]).emit('chat-message', { message: message, name: users[username] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})

module.exports = app;




