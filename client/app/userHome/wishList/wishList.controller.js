'use strict';

angular.module('freeNycApp')
  .controller('WishlistCtrl', function ($scope, $http, wishList, Auth, $rootscope, ) {
    
    var vm = this;
    $scope.obj = {};


    ///////////// ABSTRACT INTO FACTORY/SERVICE ///////////////////
     //this hopefully solves an async issue that we'll have once we deploy to heroku
    //though we do not currently experience this issue 
    var foo = function(){
        if (Auth.getCurrentUser().name){
            console.log('hitting foo: ', Auth.getCurrentUser().name)
            $scope.userId = Auth.getCurrentUser()._id; 
            $scope.userName = Auth.getCurrentUser().name; 
            $scope.numMessages = Auth.getCurrentUser().numMessages
            $scope.user = Auth.getCurrentUser()
        }
    }

    foo(); 

    $rootScope.$on('user:loggedIn', function(){
        console.log('-------------------------')
        foo(); 
    })


    $scope.wishData = {
    	itemName: "", 
    	keywords: ""
    }

    vm.getWishes = function(){
    	// $scope.user = Auth.getCurrentUser()
    	$scope.today = $scope.user.wishList;
    } 
    
    vm.addWish = function(){
        $scope.wishData.itemName = $scope.wishData.itemName.split(" ");
        $scope.wishData.keywords = $scope.wishData.keywords.split(" "); 
        console.log('wish', $scope.wishData)
        wishList.postWishToDb($scope.wishData, function(){
            $scope.today.push($scope.wishData);
            $scope.wishData = {}; 
    	})	
    }

    vm.deleteOption = function(item, index){
    	var id = $scope.user._id
    	wishList.deleteWish(id, item, function(result){
            $scope.today.splice(index, 1)
    	})
    }


    vm.editOption = function(index){
        $scope.obj[index] = true;
    }

    vm.editWish = function(index){
        var item = $scope.today[index]
        wishList.editWish(index, item, function(result){
            $scope.obj[index] = false;
        })
    }

    vm.getWishes()


  })
    .filter('joinWishlist', function(){
        return function(items){
            if (Array.isArray(items)) {
                return items.join(" ");                
            }
            else {
                return items; 
            }
        }
    })
