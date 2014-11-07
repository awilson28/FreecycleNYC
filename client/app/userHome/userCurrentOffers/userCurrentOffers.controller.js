'use strict';

angular.module('freeNycApp')
  .controller('UsercurrentoffersCtrl', function ($scope, $state, unTakenOffersFilter, Auth, pastOffersFilter, userInfoService, postService, offersOnlyFilter) {
    var vm = this;

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
  	vm.deleteOption = function(id){
		  postService.deletePost(id, function(){
        vm.getCurrentOffers();
		  });
    };

    //click event that sets the taken flag to true 
  	vm.setTaken = function(id) {
  		postService.updatePost(id, {taken: true}, function(data) {
  			console.log(data);
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
      postService.populatePost(id, function(result){
        $scope.bids = result.bids;
        $scope.userId = result.bids[0]._id 
        console.log('bids', $scope.userId)
      })
      $scope.obj = {}; 
      $scope.obj[index] = true; 


    }

    vm.notifyRecipient = function(postId, bidId){
      $scope.userBeingRatedId = bidId;
      postService.enableRatings(postId, function(rating){
        $scope.rating = rating.ratingsEnabled; 
        userInfoService.initiateTransaction(bidId, postId, function(userResult){
          console.log('userTransactionArray', userResult)
        })
      });

    }

    vm.OnItemClick = function(event) {
      $scope.formData.itemType = event;
    }

    vm.submitRating = function(id, rating) {
      userInfoService.rateTransaction(id, Number(rating), function(result) {
        console.log('CLIENT SIDE', result);
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
  		console.log('fil', filtered)
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
