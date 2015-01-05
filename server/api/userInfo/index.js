'use strict';

var express = require('express');
var controller = require('./userInfo.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.use(auth.isAuthenticated(), function(req, res, next) {
	next();
});

router.get('/', controller.index);
router.get('/userProfileInfo/', controller.show);
router.get('/listCurrentTransactions/', controller.listCurrentTransactions);
router.put('/rateUser/:id', controller.rateUser);
router.put('/initiateTransaction/:id', controller.initiateTransaction)
router.put('/abortTransaction/:postId/', controller.abortTransaction);

module.exports = router;