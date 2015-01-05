'use strict';

var _ = require('lodash');
var Post = require('../post/post.model');
var User = require('../user/user.model');


// retrieves all the user's posts, regardless of past or present, 
//for filtering on front end
exports.index = function(req, res) {
  console.log('FLAG', req.user._id);
  Post.find({user: req.user._id})
  .populate('user')
  .exec(function (err, posts) {
    if(err) { return handleError(res, err); }
    return res.json(200, posts);
  });
};


// retrieves all user information pertaining to current user 
exports.show = function(req, res) {
  User.findById(req.user._id, function (err, userInfo) {
    if(err) { return handleError(res, err); }
    if(!userInfo) { return res.send(404); }
    return res.json(userInfo);
  });
};


exports.initiateTransaction = function(req, res){
  console.log('req', req.body)
  console.log('id', req.params.id)
  // if (req.body.bool) {
    User.findByIdAndUpdate(req.params.id, {$push: {currentTransactions: req.body.id}})
        .populate('currentTransactions')
        .exec(function(err, user){
          if (err) { return handleError(res, err); }
          if(!user) { return res.send(404); }
          console.log('updated user', user)
          return res.json(200, user)
        }); 
  // }
  // else if (!req.body.bool){
  //   User.findByIdAndUpdate(req.params.id, {$pull: {currentTransactions: req.body.id}}, function(err, user){
  //         console.log('updated user', user)
  //         return res.json(200, user)
  //       });   
  //   }
}

exports.listCurrentTransactions = function(req, res) {
  console.log(req.user._id);
  // User.findById(req.user._id, {currentTransactions: 1})
  User.findById(req.user._id, {currentTransactions: 1})
      .populate('currentTransactions')
      .exec(function(err, results) {
        console.log('transactionsResults', results);
        return res.json(200, results);
      });
}

exports.rateUser = function(req, res) {
  User.findByIdAndUpdate(req.params.id, {$push : {ratingArray: req.body.rating}}, function(err, user) {
    user.computeRating(function(rating){
      console.log('RATING IN OTHER PLACE', rating);
      res.json(200, rating);
    })
  });
  Post.findByIdAndUpdate(req.body.postId, {ratingsEnabled: false}, function(err, post){
    console.log('post with ratings disabled', post)
  });
}

exports.abortTransaction = function(req, res){
  Post.findByIdAndUpdate(req.params.postId, {ratingsEnabled: false}, function(err, post){
    post.abortTransaction(req.body.id, function(newPost){
      User.findByIdAndUpdate(req.body.id, {$pull: {currentTransactions: req.body.id}}, function(err, user){
        console.log('updated post: ', newPost, 'updated user: ', user)
        return res.json(newPost)  
      })
    })
  })
}

// Updates an existing post in the DB; this route accessble through home page
exports.updateUserPost = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    return res.json(200, post)
  });
};

/**
 * Get the user's bids to display on user home page 
 */

exports.bidsPerUser = function(req, res){
  // console.log('userId', req.user._id)
  // if(req.body._id) { delete req.body._id; }
  Post.find({'bids': { $in : [req.user._id]}}, function (err, posts) {
    if (err) { return handleError(res, err); }
    if(!posts) { return res.send(404); }
    res.json(200, posts);
  });
}


function handleError(res, err) {
  return res.send(500, err);
}