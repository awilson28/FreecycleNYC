/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Userinfo = require('./userInfo.model');

exports.register = function(socket) {
  Userinfo.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Userinfo.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('userInfo:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('userInfo:remove', doc);
}