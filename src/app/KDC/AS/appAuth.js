const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


const crypto = require('crypto-browserify');
const cryptoJS = require('crypto-js');
const keypair = require('keypair');
const CircularJSON = require('circular-json');
const { ConsoleReporter } = require('jasmine');

mongoose.connect("mongodb+srv://dusan:UZO9H2pl6CCH5I13@cluster0.l13rl.mongodb.net/LoginDB?retryWrites=true&w=majority")
  .then(() => {
      console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!")
  });

const appAuth = express();
appAuth.use(cors());
appAuth.use(bodyParser.json());

appAuth.use((req, res, next) => {
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


appAuth.post('/loginMessageToAS', (req, res, next) => {
  var rsakeys = keypair(256);
  var cip = (cryptoJS.AES.encrypt(rsakeys.public, 'secret key for AS and TGS'));
  var ciphertext = CircularJSON.stringify(cip);
  var buffer1 = Buffer.from(rsakeys.private);
  let encrypted = crypto.privateEncrypt( {key: req.body.privateKey}, buffer1);
  res.status(201).json({
    publicSessionKey: encrypted.toString('base64'),
    messageForTGS: ciphertext
  })
});

module.exports = appAuth;
