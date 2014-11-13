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

  	 	vm.getCurrentTransactions = function(){
  	 		$state.go('userHome.currentTransactions')
  	 	};

      vm.getMessages = function(){
        $state.go('userHome.messages')
      }

      //'user' is the alias for this controller, so angular gets confused when we 
      //define user as obj on scope
			$scope.userInfo = Auth.getCurrentUser();
      console.log($scope.userInfo);


  		vm.getWishList = function(){
  			$state.go('userHome.wishList')
  		};

    	vm.getUserBids = function(){
    		postService.getUserBids(function(results){
    			$scope.bids = results
    		})
    	};

      vm.goToAlert = function(id) {

        $state.go('singlePost', {'id': id});
      }


      if ($state.is('userHome')){
    	 vm.getUserBids()
      }

  });
  
