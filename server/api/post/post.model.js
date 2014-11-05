'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('../user/user.model'),
    textSearch = require('mongoose-text-search');

var PostSchema = new Schema({
  postTitle: String,
  crossStreets: String,
  description: String,
  postType: String, 
  itemType: String, 
  keyWords: [String], 
  taken: Boolean, 
  dimensions: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

// PostSchema.plugin(textSearch);
PostSchema.index({ postTitle: 'text', keyWords: 'text', description: 'text'}, {weights: {postTitle: 1, keyWords: 1, description: 1} });

module.exports = mongoose.model('Post', PostSchema);