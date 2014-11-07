'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
      console.log('user in save', req.user)

    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * adds an item to a user's wish list
 */
exports.addWish = function (req, res, next) {
  User.findByIdAndUpdate(req.user._id, {$push: {wishList: req.body}}, function(err, user){
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    console.log('updated user', user)
    return res.json(200, user)
  })
};

/**
 * changes an item to a user's wish list
 */
exports.changeWish = function (req, res, next) {
  User.findById(req.user._id, function(err, user){
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    console.log('updated user', user)
    user.changeWishList(req.params.index, req.body, function(newWish){
      console.log('newWish', newWish)
      return res.json(200, newWish)
      
    })
  })
};

/**
 * retrieves a user's wish list
 */
exports.getWishes = function (req, res, next) {
  User.findByIdAndUpdate(req.user._id, {$push: {wishList: req.body}}, function(err, user){
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    console.log('updated user', user)
    return res.json(200, user)
  })
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  console.log('id', req.params.id)
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Deletes an item from the user's wishList array
 */
exports.wishList = function(req, res) {
  console.log('id', req.params.id)
  console.log('body', req.body)
  User.findByIdAndUpdate(req.params.id, {$pull: {wishList: req.body}}, function(err, user) {
    console.log('new user wishlist', user)
    if(err) return res.send(500, err);
    return res.json(204, user);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
