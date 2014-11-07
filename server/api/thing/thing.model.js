'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  messages: [{
	  body: String,
	  sender: {type: Schema.Types.ObjectId, ref: 'User'},
	  recipient: {type: Schema.Types.ObjectId, ref: 'User'}
  }],
  conversants: [{type: Schema.Types.ObjectId, ref: 'User'}]
});


module.exports = mongoose.model('Thing', ThingSchema);