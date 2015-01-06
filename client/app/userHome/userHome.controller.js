'use strict';

angular.module('freeNycApp')
  .controller('UserhomeCtrl', function ($scope, $state, $rootScope, userInfoService, postService, Auth) {
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

      var foo = function(){
        var alertsObj = {}, 
            wishIds = [];
        $scope.wishNamesArr = []; 
        if (Auth.getCurrentUser().alerts){
          $scope.userInfo = Auth.getCurrentUser().alerts; 
          if ($scope.userInfo.length > 0){
            alertsObj.idArray = $scope.userInfo; 
            userInfoService.sendArrayIdsForWishNames(alertsObj)
            .then(function listNames(wishArr){
              // console.log('returned wish arr: ', wishArr)
              $scope.wishArr = wishArr; 
              // console.log('wishArr: ', wishArr)
              wishArr.forEach(function(arrOfWish){
                arrOfWish.forEach(function(wish){
                  $scope.wishNamesArr.push(wish.postTitle)
                  wishIds.push(wish._id)
                })
              })
            })
          }
        }
      }

      foo(); 

      $rootScope.$on('user:loggedIn', function(){
        console.log('-------------------------')
        foo(); 
      })

  		vm.getWishList = function(){
  			$state.go('userHome.wishList')
  		};

    	vm.getUserBids = function(){
    		userInfoService.retrieveBidsPerUser(function(results){
    			$scope.bids = results
    		})
    	};

      vm.goToAlert = function(alert, index) {
        var wishId = wishIds[index]
        $state.go('singlePost', {'id': wishId});
      }


      if ($state.is('userHome')){
    	 vm.getUserBids()
      }

  });
  
