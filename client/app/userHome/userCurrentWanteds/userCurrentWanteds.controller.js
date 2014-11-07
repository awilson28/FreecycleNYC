'use strict';

angular.module('freeNycApp')
  .controller('UsercurrentwantedsCtrl', function ($scope,  $state, unTakenOffersFilter, pastWantedsFilter, Auth, pastOffersFilter, userInfoService, postService, offersOnlyFilter, wantedOnlyFilter) {

  	var vm = this;
    
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

	//if on .currentWanteds view, execute function
	if ($state.is('userHome.currentWanteds')){
		vm.getCurrentWanteds();		
	}
	
	//if on .pastWanteds view, execute function
	else if ($state.is('userHome.pastWanteds')){
		vm.getPastWanteds(); 		
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

