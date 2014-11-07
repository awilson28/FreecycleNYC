'use strict';

var express = require('express');
var controller = require('./userInfo.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.use(auth.isAuthenticated(), function(req, res, next) {
	next();
});

router.get('/', controller.index);
// router.get('/:id', controller.show);
router.get('/getUser/', controller.show);
router.get('/getTransactions', controller.getTransactions);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/rateUser/:id', controller.rateUser);
router.put('/initiateTransaction/:id', controller.initiateTransaction)
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;