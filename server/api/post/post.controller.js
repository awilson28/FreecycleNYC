'use strict';

var _ = require('lodash');
var Post = require('./post.model');
var User = require('../user/user.model');
var nodemailer = require('nodemailer'); 
var nodemailerConfig = require('../../config/nodemailer');



// Get list of posts
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

// find keyword
exports.findKeyword = function(req, res) {
  Post.find( { $text : { $search : req.params.keyword } } )
    .populate('user')
    .exec( function (err, data) {
      res.json(200, data);
  });
};

// Get a single post
exports.individualPost = function(req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    return res.json(post);
  });
};

// Creates a new post in the DB.
exports.create = function(req, res) {
  req.body.user = req.user._id; 
  console.log('body', req.body)
    Post.create(req.body, function(err, post) {
      if(err) { return handleError(res, err); }

      return res.json(201, post);

    });
  // }
};

//enables ratings on transactions via posts field
exports.enableRatings = function(req, res){
  console.log('body', req.body)
  Post.findByIdAndUpdate(req.params.id, {ratingsEnabled: true, $push: {inTransactionWith: req.body.userId}},  function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    return res.json(post);
    console.log(post)
  });
}


// populates bid field in the post model
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

exports.getPostBids = function(req, res){
  Post.findById(req.params.id, {'bids':1})
    .populate('bids', 'name')
    .exec(function (err, post) {
    if (err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    console.log('post', post)
    return res.json(post)
  });
}



// exports.abortTransaction = function(req, res){
//   Post.findByIdAndUpdate(req.params.postId, {ratingsEnabled: false}, function(err, post){
//     post.abortTransaction(req.body.id, function(newPost){
//       return res.json(newPost)
//     })
//   })
// }


// Updates an existing post in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Post.findByIdAndUpdate(req.params.id, req.body, function (err, post) {
    if (err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    // console.log('post', post, 'modified', numModified)
    return res.json(200, post)
    // var updated = _.merge(post, req.body);
    // console.log('updated', updated)
    // updated.save(function (err, newPost, numModified) {
    //   if (err) { return handleError(res, err); }
    //   console.log('new post', newPost, 'modified', numModified)
    //   return res.json(200, post);
    // });
  });
};

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