'use strict';

var express = require('express');
var controller = require('./post.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.use(auth.isAuthenticated(), function(req, res, next) {
	next();
});

router.get('/', controller.index);
router.get('/getBids/', controller.getUserBids);
router.get('/:keyword', controller.findKeyword);
router.get('/single/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/populateBid/:id', controller.populateBid);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;