'use strict';

var _ = require('lodash');
var Userinfo = require('./userInfo.model');
var Postinfo = require('../post/post.model');
var User = require('../user/user.model');


// Get list of userInfos
exports.index = function(req, res) {
  console.log('FLAG', req.user._id);
  Postinfo.find({user: req.user._id}, function (err, PostInfos) {
    // MAKE SURE TO MAKE THE QUERY CHECK FOR TAKEN VALUE
    if(err) { return handleError(res, err); }
    return res.json(200, PostInfos);
  }).populate('user');
};

// Get a single userInfo
exports.show = function(req, res) {
  User.findById(req.user._id, function (err, userInfo) {
    if(err) { return handleError(res, err); }
    if(!userInfo) { return res.send(404); }
    return res.json(userInfo);
  });
};

// Creates a new userInfo in the DB.
exports.create = function(req, res) {
  Userinfo.create(req.body, function(err, userInfo) {
    if(err) { return handleError(res, err); }
    return res.json(201, userInfo);
  });
};

// Updates an existing userInfo in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Userinfo.findById(req.params.id, function (err, userInfo) {
    if (err) { return handleError(res, err); }
    if(!userInfo) { return res.send(404); }
    var updated = _.merge(userInfo, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, userInfo);
    });
  });
};


exports.initiateTransaction = function(req, res){
  console.log('req', req.body)
  console.log('id', req.params.id)
  User.findByIdAndUpdate(req.params.id, {$push: {currentTransactions: req.body}}, function(err, user){
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    console.log('updated user', user)
    return res.json(200, user)
  }) 
}

// Deletes a userInfo from the DB.
exports.destroy = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    user.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}