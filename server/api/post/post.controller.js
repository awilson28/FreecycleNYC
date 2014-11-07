'use strict';

var _ = require('lodash');
var Post = require('./post.model');
var User = require('../user/user.model');


// Get list of posts
exports.index = function(req, res) {
  var user = req.user.name;
  //bids: {$nin: [req.user._id]}
  Post.find({taken: false})
      .populate('user')
      .exec(function (err, posts) {
        if(err) { return handleError(res, err); }
        return res.json(200, posts);
      });
};

// find keyword
exports.findKeyword = function(req, res) {
    Post.find( { $text : { $search : req.params.keyword } } ).exec( function (err, data) {
      res.json(200, data);
    });
};

// Get a single post
exports.show = function(req, res) {
  Post.findById(req.params.id, function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    return res.json(post);
  });
};

// Creates a new post in the DB.
exports.create = function(req, res) {
  req.body.user = req.user._id; 
  // if (req.user){
    Post.create(req.body, function(err, post) {
      if(err) { return handleError(res, err); }

      return res.json(201, post);

    });
  // }
};

//enables ratings on transactions via posts field
exports.enableRatings = function(req, res){
  Post.findByIdAndUpdate(req.params.id, {ratingsEnabled: true}, function (err, post) {
    if(err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    return res.json(post);
  });
}

exports.getUserBids = function(req, res){
  // console.log('userId', req.user._id)
  // if(req.body._id) { delete req.body._id; }
  Post.find({'bids': { $in : [req.user._id]}}, function (err, posts) {
    if (err) { return handleError(res, err); }
    if(!posts) { return res.send(404); }
    res.json(200, posts);
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

// Updates an existing post in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Post.findById(req.params.id, function (err, post) {
    if (err) { return handleError(res, err); }
    if(!post) { return res.send(404); }
    var updated = _.merge(post, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, post);
    });
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