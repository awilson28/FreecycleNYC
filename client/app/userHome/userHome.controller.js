'use strict';

angular.module('freeNycApp')
  .controller('UserhomeCtrl', function ($scope, $state, userInfoService, postService, Auth) {
  		var vm = this;


        //state.go's are rendundant, see userHome.html
  	 	vm.getCurrentOffers = function(){
  	 		$state.go('userHome.currentOffers')
  	 	};

  	 	vm.getCurrentWanteds = function(){
  	 		$state.go('userHome.currentWanteds')
  	 	};

  	 	vm.getPastOffers= function(){
  	 		$state.go('userHome.pastOffers')
  	 	};

  	 	vm.getPastWanteds = function(){
  	 		$state.go('userHome.pastWanteds')
  	 	};

  	 	// vm.retrieveUser = function(){
    			$scope.user = Auth.getCurrentUser(); 
          console.log('user', $scope.user)
          console.log('user', $scope.user.name)
      // }

  		vm.getWishList = function(){
  			$state.go('userHome.wishList')
  		};

  		// $scope.user = Auth.getCurrentUser();

  	vm.getUserBids = function(){
  		postService.getUserBids(function(results){
  			$scope.bids = results
  		})
  	}
      // vm.retrieveUser()

    // setTimeout(function(){
    // }, 2000)

    if ($state.is('userHome')){
  	 vm.getUserBids()
    }

  });
  
