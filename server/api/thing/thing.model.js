'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('../user/user.model');


var ThingSchema = new Schema({
  messages: [{
	  body: String,
	  //TTL index 
	  date: {type: Date, expires: 604800, default: Date.now},
	  sender: {type: Schema.Types.ObjectId, ref: 'User'},
	  recipient: {type: Schema.Types.ObjectId, ref: 'User'},
	  roomId: String
  }],
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
		this.save(function (err){
			User.findById(recipient, function(err, user){
				console.log('rec', recipient)
				console.log('user', user)
				if (bool === true){
					user.numMessages += 1; 
				}
				else if (bool === false && user.numMessages > 0) {
					user.numMessages -= 1; 
				}
				user.save(function(err, user){
					callback(user)					
				})
			})	
		})
	}
}
module.exports = mongoose.model('Thing', ThingSchema);