'use strict';

angular.module('freeNycApp')
  .controller('UserhomeCtrl', function ($scope, $state, userInfoService, postService, userIdentity, Auth) {
  		var vm = this;

  	 	vm.getCurrentOffers = function(){
  	 		$state.go('userHome.currentOffers')
  	 	};

  	 	vm.getCurrentWanteds = function(){
  	 		$state.go('userHome.currentWanteds')
  	 	};

  	 	vm.getPastOffers= function(){
  	 		$state.go('userHome.pastOffers')
  	 	};

  	 	vm.retrieveUser = function(){
  		userInfoService.retrieveUser(function(data) {
  			userIdentity.name = data.name;
  			userIdentity._id = data._id;
  			userIdentity.location = data.location; 
  			userIdentity.wishList = data.wishList; 
  			userIdentity.bookmarkedItems = data.bookmarkedItems; 
  			userIdentity.rating = data.rating; 
  			userIdentity.email = data.email;
  			console.log('NEW', userIdentity);
  			$scope.user = userIdentity; 
  		});
  		console.log('AUTH', Auth.getCurrentUser());
  	};

  	vm.getUserBids = function(){
  		postService.getUserBids(function(results){
  			$scope.bids = results
  			console.log('results', results)
  		})
  	}

  	vm.retrieveUser()
  	vm.getUserBids()

  })
  .value('userIdentity', {
  	name: "",
	_id: "",
	location: "", 
	wishList: [], 
	bookmarkedItems: [],
	rating: 0, 
	email: ""
  			
  })
