'use strict';

var express = require('express');
var controller = require('./userInfo.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.use(auth.isAuthenticated(), function(req, res, next) {
	next();
});

router.get('/', controller.index);
router.get('/userHome/userProfileInfo/', controller.show);
router.get('/userHome/listCurrentTransactions/', controller.listCurrentTransactions);
router.get('/userHome/bidsPerUser/', controller.bidsPerUser);
router.get('/userHome/wishList/items', controller.wishListNames);
router.put('/userHome/modifyPost/:id', controller.updateUserPost)
router.put('/userOffers/enableRatings/:id/', controller.enableRatings);
router.put('/userOffers/populateBidArray/:id/', controller.namesOfBiddersOnPost);
router.put('/rateUser/:id', controller.rateUser);
router.put('/initiateTransaction/:id', controller.initiateTransaction)
router.put('/abortTransaction/:postId/', controller.abortTransaction);

module.exports = router;