'use strict';

angular.module('freeNycApp')
  .controller('WishlistCtrl', function ($scope, $http, wishList, Auth) {
    
    var vm = this;
    $scope.obj = {}


    $scope.wishData = {
    	itemName: "", 
    	keywords: ""
    }

    vm.getWishes = function(){
    	$scope.user = Auth.getCurrentUser()
    	$scope.today = $scope.user.wishList;
    } 
    
    vm.addWish = function(){
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


  });
