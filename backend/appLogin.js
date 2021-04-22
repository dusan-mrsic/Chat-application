const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});


appLogin.post('/register', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then( hash => {
    console.log(req.body.password);
    const user =  new User({
      name: req.body.name,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hash
    })

    User.findOne({ username:req.body.username }).then(user1 => {
      if(user1){
        return res.status(401).json({
          message: "User Already Exist!"
        })
      }

      user.save().then(result => {
        if(!result){
          return res.status(500).json({
            message: "Error Creating User!"
          })
        }
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  });
});

appLogin.post('/login', (req, res, next) => {
  let fetchedUser;
  User.findOne({ username: req.body.username }).then(user => {
      if(!user){
        return res.status(401).json({
          message: "Authentication failed! User does not exist!"
        })
      }
      fetchedUser=user;
      console.log(req.body.password);
      console.log(user.password);
      return bcrypt.compare(req.body.password, user.password).then( result => {
        if(!result){
          return res.status(401).json({
            message: "Authentication failed! Inccorect password!"
          })
        }
        const token = jwt.sign(
          { username: fetchedUser.username, userId: fetchedUser._id },
          "secret_this_should_be_longer", // make other secret
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id
        });
      })
    })
    .catch(e=>{
      console.log(e)
    });
});


module.exports = appLogin;
