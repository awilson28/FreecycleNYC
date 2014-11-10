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
  img: Array,
  ratingsEnabled: Boolean,
  bids: [{type: Schema.Types.ObjectId, ref: 'User'}], 
  date: {type: Date, default: Date.now},
  inTransactionWith: [{type: Schema.Types.ObjectId, ref: 'User'}],
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

// PostSchema.plugin(textSearch);


//set number of bids as a function of bids array
PostSchema.methods = {
  setBids: function(id, callback){
    if (this.bids.indexOf(id) === -1){
      console.log('populating bids array')
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
  }, 
  abortTransaction: function(id, callback){
    console.log('id', id)
    console.log('bids before', this.bids)
    var index = this.bids.indexOf(id)
    console.log('index', index)
    this.bids.splice(index, 1)
    console.log('bids', this.bids)
    this.inTransactionWith = []; 
    this.save()
    callback(this);
  }
}

PostSchema.post('save', function(users){
  this.findRelevantUsers(function(users, self){
    for (var i = 0; i < users.length; i++){
      if (users[i].alerts.indexOf(self._id) === -1) {
        users[i].alerts.push(self._id)
        users[i].save()     
      }
    }
  })
})

PostSchema.index({ postTitle: 'text', keyWords: 'text', description: 'text'}, {weights: {postTitle: 1, keyWords: 1, description: 1} });

module.exports = mongoose.model('Post', PostSchema);