/**
 * Broadcast updates to client when the model changes
 */

'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Thing = require('./thing.model');
var User = require('../user/user.model'); 
var nodemailerConfig = require('../../config/nodemailer');

exports.register = function(socketio) {
  

	socketio.on('connection', function(socket){

		socket.on('sendMessage', function(data){
			if (socket.rooms.length){
				socket.rooms.forEach(function(room){
					socket.leave(room)
				})
			}
			console.log('io', socketio.to)
			socket.join(data.roomId)
			User.findById(data.recipient, function(err, user){
    		var options = {
	        from: 'freestorenyc@gmail.com',
	        to: 'ayana.d.i.wilson@gmail.com',
	        subject: 'someone has bid on your item.',
	        text: 'Check out your messages to learn more or email that person at ' + data.userEmail + '.'
      	}
		    nodemailerConfig.transporter.sendMail(options, function(error, info){
		        if(error){
		            console.log(error);
		        }else{
		            console.log('Message sent: ' + info.response);
		        }
		    nodemailerConfig.transporter.close();
		    }); 
	  	})
		  Thing.create({messages: [data], conversants: [data.recipient, data.sender]}, function(err, thing) {
		    thing.setNumMessages(data.recipient, true, function(thing){
		      if(err) { return handleError(res, err); }
		      socketio.to(data.roomId).emit('MessageSent', thing)
		    });    
		  })
		})

		socket.on('getMessages', function(data){
			Thing.find({conversants : {$in: [data.userId]}})
      	.populate('conversants messages.sender messages.recipient', 'name')
      	.exec(function (err, things) {
      		if(err) { return handleError(res, err); }
          if(!things) { return res.send(404); }
          console.log('things: ', things)
         socketio.to(data.roomId).emit('allMessages', things)
      });
		})

		socket.on('reply', function(data){
			console.log('data: ', data)
			data.sender = data.sender._id; 
			data.recipient = data.recipient._id; 
			console.log('data after: ', data)
			socket.join(data.roomId)
			Thing.findByIdAndUpdate(data.convoId, {$push: {messages: data}}, function (err, thing) {
		    if(err) { return handleError(res, err); }
		    if(!thing) { return res.send(404); }
		    thing.setNumMessages(data.recipient, true, function(thing){
		      // return res.json(thing); 
		      socketio.to(data.roomId).emit('replySent', thing)  
		  	})
  		});
		})

		socket.on('displayMessages', function(data){
			Thing.findById(data.talkId)
		    .populate('conversants messages.sender messages.recipient', 'name')
		    .exec(function (err, thing) {
		    thing.setNumMessages(data.userId, false, function(thing){
		      if(err) { return handleError(res, err); }
		      if(!thing) { return res.send(404); }
		      socketio.to(data.roomId).emit('convoUpdated', thing)  
		    })
		  });
		})




	})

}

// function onSave(socket, doc, cb) {
//   socket.emit('thing:save', doc);
// }

// function onRemove(socket, doc, cb) {
//   socket.emit('thing:remove', doc);
// }