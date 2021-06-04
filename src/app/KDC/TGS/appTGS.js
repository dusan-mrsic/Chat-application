const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');


const crypto = require('crypto-browserify');
const cryptoJS = require('crypto-js');
const keypair = require('keypair');
const CircularJSON = require('circular-json');

userKeys = new Array();

mongoose.connect("mongodb+srv://dusan:UZO9H2pl6CCH5I13@cluster0.l13rl.mongodb.net/LoginDB?retryWrites=true&w=majority")
  .then(() => {
      console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!")
  });

const appTGS = express();
appTGS.use(cors());
appTGS.use(bodyParser.json());

appTGS.use((req, res, next) => {
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


appTGS.post('/messageToTGS', (req, res, next) => {
  var publicKey = cryptoJS.AES.decrypt(JSON.parse(req.body.messageFromAStoTGS), 'secret key for AS and TGS');
  publicKey = publicKey.toString(cryptoJS.enc.Utf8);
  let buffer1 = Buffer.from(req.body.key, 'base64');
  var clientKey = crypto.publicDecrypt(publicKey, buffer1);
  clientKey = clientKey.toString('utf8');
  userKeys[req.body.username] = clientKey;
  console.log(userKeys[req.body.username]);
  res.status(201).json({
    message: "Successfully sent the key"
  })
});

module.exports = appTGS;
