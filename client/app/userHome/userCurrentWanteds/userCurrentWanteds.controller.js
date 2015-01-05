'use strict';

angular.module('freeNycApp')
  .controller('UsercurrentwantedsCtrl', function ($scope,  $state, unTakenOffersFilter, pastWantedsFilter, Auth, pastOffersFilter, userInfoService, postService, offersOnlyFilter, wantedOnlyFilter) {

  	var vm = this;

  	$scope.obj = {};
    $scope.post = {};
    
    //retrieves all posts associated with a user and passes them through the currentWanteds filter
  	vm.getCurrentWanteds = function(){
	  	userInfoService.getUserPosts(function(data) {
	  		$scope.currentWanteds  = wantedOnlyFilter(data, 'postType');
	  	});
  	};

  	//click event that initiates post deletion from database
  	vm.deleteOption = function(id, index){
		postService.deletePost(id, function(){
      $scope.currentWanteds.splice(index, 1) 
			// vm.getCurrentWanteds();
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

  	vm.submitData = function(id, post, index) {
      // console.log('id', id)
      // console.log('post', post)
      post.user = post.user._id
      userInfoService.updatePost(id, post, function(result){
        $scope.obj[index] = false;
        // console.log('updated want', result)
      });

  	}

	//if on .currentWanteds view, execute function
	if ($state.is('userHome.currentWanteds')){
		vm.getCurrentWanteds();		
	}
	
	//if on .pastWanteds view, execute function
	else if ($state.is('userHome.currentTransactions')){
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

