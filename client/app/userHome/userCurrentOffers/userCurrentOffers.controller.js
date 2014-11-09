'use strict';

angular.module('freeNycApp')
  .controller('UsercurrentoffersCtrl', function ($scope, $state, unTakenOffersFilter, Auth, pastOffersFilter, userInfoService, postService, offersOnlyFilter) {
    var vm = this;

      $scope.obj = {}; 
    //retrives the user's current offers for the current offers view
    //pings userInfo api for all posts associated with that user and then passes data through 
    //the offers only filter, and then through the untaken filter 
    vm.getCurrentOffers = function(){
      userInfoService.getUserPosts(function(data) {
        var resultBeforeTakenFilter = offersOnlyFilter(data, 'postType');
        $scope.currentOffers = unTakenOffersFilter(resultBeforeTakenFilter, 'taken')
      });
    };

    //click event that initiates post deletion from database 
    vm.deleteOption = function(id, index){
      postService.deletePost(id, function(){
        $scope.currentOffers.splice(index, 1)
      });
    };

    //click event that sets the taken flag to true 
    vm.setTaken = function(id, index) {
      postService.updatePost(id, {taken: true}, function(data) {
        $scope.currentOffers[index].taken = true; 
      });
    };

    //pings the database to get a user's posts and then passes that data through the 
    //right filters 
    vm.getPastOffers = function(){
      userInfoService.getUserPosts(function(data) {
        var resultBeforeTakenFilter = offersOnlyFilter(data, 'postType');
        $scope.pastOffers = pastOffersFilter(resultBeforeTakenFilter, 'taken')
      });
    };

    vm.gifting = function(id, index){
      $scope.obj[index] = true;  
      postService.retrieveBidsPost(id, function(result){
        console.log('retrieved bids', result)
        $scope.bids = result.bids;
        $scope.userId = result.bids[0]._id 
        console.log('bids', $scope.userId)
      });
    }

    vm.abortTransaction = function(postId, userId, index){
      console.log('id', userId)
      var obj = {id: userId}
      postService.abortTransaction(postId, obj, function(result) {
        $scope.currentOffers[index].ratingsEnabled = false; 
        console.log(result)
      })
      var temp = {id: postId, bool: false}
        userInfoService.initiateTransaction(userId, temp, function(result){
          console.log('user after aborted transaction', result)
        })

    }

    vm.notifyRecipient = function(postId, bidId, index){
      var id = bidId; 
      var obj = {userId: id}
      postService.enableRatings(postId, obj, function(rating){
        $scope.rating = rating.ratingsEnabled;
        $scope.currentOffers[index].ratingsEnabled = true; 
        var temp = {id: postId, bool: true}
        userInfoService.initiateTransaction(bidId, temp, function(userResult){
          console.log('userTransactionArray', userResult)
        })
      });

    }

    //user being rated id
    vm.submitRating = function(userBeingRatedId, rating, postId, index) {
      var obj = {rating: Number(rating), postId: postId}
      userInfoService.rateTransaction(userBeingRatedId, obj, function(result) {
        console.log('CLIENT SIDE', result);
        $scope.currentOffers[index].ratingsEnabled = false; 
      });
    }


    //loads current offers if the currentOffers state is operative
  	if ($state.is('userHome.currentOffers')){
  		vm.getCurrentOffers();
  	}

    //loads past offers if the pastOffers state is operative
  	else if ($state.is('userHome.pastOffers')){
  		vm.getPastOffers(); 		
  	}

  })
  .filter('unTakenOffers', function(){
  	return function(items){
  		var filtered = [];
  		for (var i = 0; i < items.length; i++){
  			//if items[i].taken != true
  			if (!items[i].taken) {
  				filtered.push(items[i])
  			}
  		}
  	return filtered;
  	}
  })
  .filter('pastOffers', function(){
  	return function(items){
  		var filtered = [];
  		for (var i = 0; i < items.length; i++){
  			//if items[i].taken === true
        //if (!items[i].taken)
  			if (items[i].taken) {
  				filtered.push(items[i])
  			}
  		}
  		console.log('fil', filtered)
  	return filtered;
  	}
  })
