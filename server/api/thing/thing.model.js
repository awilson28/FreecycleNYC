'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('../user/user.model');


var ThingSchema = new Schema({
  messages: [{
	  body: String,
	  date: {type: Date, default: Date.now},
	  sender: {type: Schema.Types.ObjectId, ref: 'User'},
	  recipient: {type: Schema.Types.ObjectId, ref: 'User'},
	  roomId: String,
  }],
  conversants: [{type: Schema.Types.ObjectId, ref: 'User'}], 
  numNewMessages: {type: Number, default: 0} 
});

ThingSchema.methods = {
	setNumMessages: function(recipient, bool, callback){
		if (bool === true){
			this.numNewMessages += 1;		
		}
		else if (bool === false && this.numNewMessages > 0) {
			this.numNewMessages -= 1; 
		}
		this.save()
		User.findById(recipient, function(err, user){
			console.log('rec', recipient)
			console.log('user', user)
			if (bool === true){
				user.numMessages += 1; 
			}
			else if (bool === false && user.numMessages > 0) {
				user.numMessages -= 1; 
			}
			user.save()
			callback(user)
		})
	}
}
module.exports = mongoose.model('Thing', ThingSchema);