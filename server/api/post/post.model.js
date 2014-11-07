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
  fulfilled: Boolean,
  dimensions: String,
  numBids: Number,
  ratingsEnabled: Boolean,
  bids: [{type: Schema.Types.ObjectId, ref: 'User'}], 
  date: {type: Date, default: Date.now},
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

// PostSchema.plugin(textSearch);


//set number of bids as a function of bids array
PostSchema.methods = {
  setBids: function(id, callback){
    if (this.bids.indexOf(id) === -1){
      this.bids.push(id)
      this.numBids = this.bids.length; 
      this.save()
      callback(this); 
    }
  }, 
  findRelevantUsers: function(callback){
    var self = this; 
    User.find({'wishList.itemName': {$in: self.keyWords}}, function(err, users){
      callback(users, self)
    })
  }
}

PostSchema.post('save', function(users){
  this.findRelevantUsers(function(users, self){
    for (var i = 0; i < users.length; i++){
      users[i].alerts.push(self._id)
      users[i].save()
    }
  })
})

PostSchema.index({ postTitle: 'text', keyWords: 'text', description: 'text'}, {weights: {postTitle: 1, keyWords: 1, description: 1} });

module.exports = mongoose.model('Post', PostSchema);