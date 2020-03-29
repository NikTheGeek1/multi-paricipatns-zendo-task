const mongoose = require('mongoose'); // requiring the module

const userSchema = mongoose.Schema({ // creating the schema (data structure which will save)

  username: {type: String, unique: false},
  room: {type: String, unique: false},
  trial: {type: Number, unique: false},
  data: {type: Object, unique: false},
  prior: {type: Array, unique: false},
  posterior: {type: Array, unique: false},
  disp_order: {type: Array, unique: false},
  rule: {type: String, unique: false},
  ph4_answer: {type: String, unique: false},



  //userImage: {type: String, default: 'ddefault.png'}
});

module.exports = mongoose.model('trial', userSchema); // exporting the user data
