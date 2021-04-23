const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://dusan:UZO9H2pl6CCH5I13@cluster0.l13rl.mongodb.net/MessagesDB?retryWrites=true&w=majority")
  .then(() => {
      console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!")
  });


const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());
const Message = require("./models/message");
let users = []
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
    if(name != null) onlineUsers.push(name)
    io.emit('user-connected', onlineUsers)
  })
  socket.on('send-chat-message', function data(message, username, fromUsername){
    const sentMessage = new Message({
      uid: fromUsername + username,
      fromUser: fromUsername,
      toUser: String(username),
      datetime: new Date(),
      message: message
    });
    sentMessage.save(function(err){
      if(err) console.log(err);
    });
    socket.broadcast.to(users[username]).emit('chat-message', { message: message, name: users[username] });
  })
  socket.on('request-messages', function data1(toUsername, fromUsername){
    console.log(toUsername+fromUsername);
    Message.find({uid:{$in:[toUsername+fromUsername, fromUsername+toUsername]}}).then( messages => {
      socket.emit('receive-messages',messages);
      console.log(messages);
    })
  })
  socket.on('disconnect-force', (name) => {
    console.log("dissconnected");
    const index = onlineUsers.indexOf(name);
    onlineUsers.splice(index,1);
    io.emit('user-disconnected', onlineUsers)
    delete users[name];
    console.log(users);
  })
})

module.exports = app;
