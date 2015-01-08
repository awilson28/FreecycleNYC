'use strict';

angular.module('freeNycApp')
  .controller('UserhomeCtrl', function ($scope, $state, $stateParams, $rootScope, userInfoService, messageService, postService, Auth, socket) {
      var vm = this; 

      var bar = function(callback){
        var user, 
            alertsObj = {}, 
            wishIds = []; 
        $scope.wishNamesArr = [];  
        //assignment inside if condition; this is not supposed to return a boolean 
        if (user = Auth.getCurrentUser()){
            console.log('hitting bar: ', user)
            $scope.userInfo = user.alerts; 
            $scope.userId = user._id; 
            $scope.userName = user.name; 
            $scope.userRating = user.rating; 
            if ($scope.userInfo && $scope.userInfo.length > 0){
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
        callback()
      }

      vm.getAllMessages = function(){
          var data = {
              userId: $scope.userId, 
              roomId: messageService.room.convoId
          }
          socket.socket.emit('getMessages', data)
      }

      bar(vm.getAllMessages); 

      $rootScope.$on('user:loggedIn', function(){
        // console.log('-------------------------')
        bar(vm.getAllMessages); 
      })


      socket.socket.on('allMessages', function(data){
        // console.log('in here!!')
        $scope.communication = data;
        messageService.messages.render = data; 
        // console.log('messages before click: ', $scope.communication)
      })

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
  
