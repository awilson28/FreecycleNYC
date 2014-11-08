'use strict';

angular.module('freeNycApp')
  .controller('UsercurrentwantedsCtrl', function ($scope,  $state, unTakenOffersFilter, pastWantedsFilter, Auth, pastOffersFilter, userInfoService, postService, offersOnlyFilter, wantedOnlyFilter) {

  	var vm = this;

  	$scope.obj = {};
    
    //retrieves all posts associated with a user and passes them through the currentWanteds filter
  	vm.getCurrentWanteds = function(){
	  	userInfoService.getUserPosts(function(data) {
	  		$scope.currentWanteds  = wantedOnlyFilter(data, 'postType');
	  	});
  	};

  	//click event that initiates post deletion from database
  	vm.deleteOption = function(id){
		postService.deletePost(id, function(){
			vm.getCurrentWanteds();
		});
	};

	//retrieves all post associated with a user and passes them through a wantedsOnly and PastWanteds filters
	vm.getPastWanteds = function(){
		userInfoService.getUserPosts(function(data){
			//at this time, no way to differentiate between past wanteds and current wanteds
			//could easily add a 'fulfilled' tag to post schema
			var pastWantedsBeforeFilter = wantedOnlyFilter(data, 'postType');
			$scope.pastWanteds = pastWantedsFilter(pastWantedsBeforeFilter, 'fulfilled')
				
		})
	}

	vm.editOption = function(index){
		$scope.obj[index] = true

	}

	//click event that sets the item type listed in the drop down menu as the main menu item
  	vm.OnItemClick = function(event) {
    	$scope.formData.itemType = event;
  	}

  	vm.getMyTransactions = function() {
  		userInfoService.getMyTransactions(function(transactions) {
  			$scope.myTransactions = transactions;
  			console.log('FLAG', $scope.myTransactions);
  		});
  	}

  	vm.submitRating = function(id, rating) {
  		userInfoService.rateTransaction(id, Number(rating), function(result) {
  			console.log('CLIENT SIDE', result);
  		});
  	}

	//if on .currentWanteds view, execute function
	if ($state.is('userHome.currentWanteds')){
		vm.getCurrentWanteds();		
	}
	
	//if on .pastWanteds view, execute function
	else if ($state.is('userHome.pastWanteds')){
		// vm.getPastWanteds(); 
		vm.getMyTransactions();		
	}

  })
  .filter('pastWanteds', function(){
  	return function(items){
  		var filtered = []; 
  		for (var i = 0; i < items.length; i++){
  			if (items[i].fulfilled){
  				filtered.push(items[i])					
  			}
  		}
  		return filtered;
  	}
  })
  .controller('UserRatingCtrl', function($scope) {

  })
