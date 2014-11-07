'use strict';

angular.module('freeNycApp')
  .controller('WishlistCtrl', function ($scope, $http, wishList, Auth) {
    
    var vm = this;

    $scope.wishData = {
    	itemName: "", 
    	keywords: ""
    }

    vm.getWishes = function(){
    	$scope.user = Auth.getCurrentUser()
    	$scope.today = $scope.user.wishList;
    	console.log('user', $scope.user)
    } 
    
    vm.addWish = function(){
    	wishList.postWishToDb($scope.wishData, function(){
    		vm.getWishes()
    	})	
    }

    vm.deleteOption = function(item){
    	console.log('item', item)
    	var id = $scope.user._id
    	console.log('in event', id)
    	wishList.deleteWish(id, item, function(result){
    		console.log('new wishlist', result)
    		vm.getWishes(); 
    	})
    }

    $scope.obj = {}

    vm.editOption = function(index){
        $scope.obj[index] = true;
    }

    vm.editWish = function(index){
        var item = $scope.today[index]
        wishList.editWish(index, item, function(result){
            console.log('result', result)
            console.log(Auth.getCurrentUser())
            // $scope.variable = result.wishList
        })
    }
    
    
     //    $scope.$watch('item.itemName', function (val) {
     //    	$scope.item.itemName = val; 
    	// });

    	// $scope.$watch('item.keywords', function (val) {
     //    	$scope.item.keywords = val; 
    	// });






    vm.getWishes()


  });
