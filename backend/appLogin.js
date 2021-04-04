const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const User = require('./models/user.js');

mongoose.connect("mongodb+srv://dusan:UZO9H2pl6CCH5I13@cluster0.l13rl.mongodb.net/LoginDB?retryWrites=true&w=majority")
  .then(() => {
      console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!")
  });

const appLogin = express();
appLogin.use(cors());
appLogin.use(bodyParser.json());

appLogin.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

appLogin.post('/api/register', (req, res, next) => {
  const user =  new User({
    name: req.body.name,
    lastName: req.body.lastName,
    username: req.body.username,
    password: req.body.password

  })
  user.save();
  if(!req.body.name){
    return res.status(201).json({
      message: "err"
    });
  }
  res.status(201).json({
    message: "User added successfully"
  });
});

appLogin.get('/api/login', (req, res, next) => {
  User.find().then(documents => {
    res.status(201).json({
      users: documents
    });
  });
});


module.exports = appLogin;
