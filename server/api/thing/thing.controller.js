/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Thing = require('./thing.model');

// Get list of things
exports.index = function(req, res) {
  Thing.find(function (err, things) {
    if(err) { return handleError(res, err); }
    return res.json(200, things);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    return res.json(thing);
  });
};

// Gets a user's received messages
exports.getMessages = function(req, res) {
  Thing.find({conversants : {$in: [req.user._id]}}, function (err, things) {
    if(err) { return handleError(res, err); }
    if(!things) { return res.send(404); }
    return res.json(things);
  }).populate('conversants', 'name');
};

// reply to a message
exports.communicate = function(req, res) {
  //req.params.id indicates the id of the person receiving the message
  Thing.findByIdAndUpdate(req.params.id, {$push: {messages: req.body}}, function (err, things) {
    if(err) { return handleError(res, err); }
    if(!things) { return res.send(404); }
    return res.json(things);
  });
};

// .findOne({ "messages[0].recipient": })


// Gets a user's sent messages
// exports.getSentMessages = function(req, res) {
//   req.body.sender = req.user._id;
//   Thing.find({sender: req.user._id}, function (err, things) {
//     if(err) { return handleError(res, err); }
//     if(!things) { return res.send(404); }
//     return res.json(things);
//   });
// };

// Creates a new thing in the DB.
exports.create = function(req, res) {
  req.body.sender = req.user._id;
  Thing.create({messages: [req.body], conversants: [req.body.recipient, req.user._id]}, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.json(201, thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Thing.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Thing.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.send(404); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}