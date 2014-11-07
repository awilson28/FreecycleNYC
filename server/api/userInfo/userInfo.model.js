'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserinfoSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Userinfo', UserinfoSchema);