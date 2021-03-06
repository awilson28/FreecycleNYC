'use strict';

var _ = require('lodash');
var Post = require('./post.model');
var User = require('../user/user.model');
var nodemailer = require('nodemailer'); 
var nodemailerConfig = require('../../config/nodemailer');



// Gets all posts in the database where taken is set to false
exports.index = function(req, res) {
  var user = req.user.name;
  Post.find({taken: false})
    .sort({date: -1})
    .populate('user')
    .exec(function (err, posts) {
      if(err) { return handleError(res, err); }
      return res.json(200, posts);
  });
};

// finds posts that match submitted keywords
exports.findKeyword = function(req, res) {
  Post.find( { $text : { $search : req.params.keyword } } )
    .populate('user')
    .exec( function (err, data) {
      res.json(200, data);
  });
};

// Get a single post by post id 
exports.individualPost = function(req, res) {
  console.log('in here')
  Post.findById(req.params.id, function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    return res.json(post);
  });
};

// Creates a new post in the DB.
exports.create = function(req, res) {
  req.body.user = req.user._id; 
  // console.log('body', req.body)
  Post.create(req.body, function(err, post) {
    if(err) { return handleError(res, err); }
    return res.json(201, post);
  });
};

// populates bid field in the post model upon clicking 'bid' from allItems
exports.populateBid = function(req, res) {
  // console.log('id', req.user._id)
  if(req.body._id) { delete req.body._id; }
  Post.findById(req.params.id)
    .populate('bids')
    .exec(function (err, post) {
      if (err) { return handleError(res, err); }
      if(!post) { return res.send(404); }
      post.setBids(req.user._id, function(newPost){
        return res.json(newPost)
    });
  });
};


// exports.abortTransaction = function(req, res){
//   Post.findByIdAndUpdate(req.params.postId, {ratingsEnabled: false}, function(err, post){
//     post.abortTransaction(req.body.id, function(newPost){
//       return res.json(newPost)
//     })
//   })
// }


// Deletes a post from the DB.
exports.destroy = function(req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    post.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}