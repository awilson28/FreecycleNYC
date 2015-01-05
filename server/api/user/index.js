'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/userHome/allUserWishes/', auth.isAuthenticated(), controller.allUserWishes);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.delete('/userHome/removeWish/:id/', auth.isAuthenticated(), controller.removeWish);
router.put('/userHome/changeWish/:index/', auth.isAuthenticated(), controller.changeWish);
router.post('/', controller.create);
router.post('/userHome/newWish/', auth.isAuthenticated(), controller.addWish);
router.put('/:id/password', auth.isAuthenticated(), controller.changePassword);
router.get('/:id', auth.isAuthenticated(), controller.show);

module.exports = router;
