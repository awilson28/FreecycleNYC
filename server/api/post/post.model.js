'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var User = require('../user/user.model')

var PostSchema = new Schema({
  postTitle: String,
  location: String,
  description: String,
  postType: String, 
  itemType: String, 
  keywords: [String], 
  taken: Boolean, 
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Post', PostSchema);