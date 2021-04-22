const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  uid: {type: String},
  fromUser: {type: String},
  toUser: {type: String},
  datetime: {type: Date},
  message: {type: String}
});

module.exports = mongoose.model('Message', userSchema);
