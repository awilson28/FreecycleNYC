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

     $scope.item = {
    		itemName: "", 
    		keywords: ""
  		}; 
    
        $scope.$watch('item.itemName', function (val) {
        	$scope.item.itemName = val; 
    	});

    	$scope.$watch('item.keywords', function (val) {
        	$scope.item.keywords = val; 
    	});

  $scope.saveUser = function() {
    // $scope.user already updated!
    // return $http.post('/saveUser', $scope.user).error(function(err) {
    //   if(err.field && err.msg) {
    //     // err like {field: "name", msg: "Server-side error for this username!"} 
    //     $scope.editableForm.$setError(err.field, err.msg);
    //   } else { 
    //     // unknown error
    //     $scope.editableForm.$setError('name', 'Unknown error!');
    //   }
    // });
  };




    vm.getWishes()


  });
