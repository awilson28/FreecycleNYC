'use strict';

angular.module('freeNycApp')
  .controller('AllitemsCtrl', function ($scope, offersOnlyFilter, wantedOnlyFilter, postService) {
	
	var vm = this; 
	var keyword = 'blue'; 

	vm.getPosts = function(){
		postService.getData(function(results){
			$scope.allPosts = results;
		// $scope.allPosts = offersOnlyFilter(results, 'postType');
		})   
	}

	postService.filterData(keyword, function(results){
		$scope.filteredData = results; 
	});

	vm.deleteOption = function(id){
		postService.deletePost(id, function(){
			vm.getPosts()
		})
	}

	vm.getPosts()
	
  })
  .filter('offersOnly', function(){
  	return function(items){
  		var filtered = [];
  		for (var i = 0; i < items.length; i++){
  			if (items[i].postType === 'offered') {
  				console.log('item', items)
  				filtered.push(items[i])
  			}
  		}
  	return filtered;
  	}
  })
  .filter('wantedOnly', function(){
  	return function(items){
  		var filtered = [];
  		for (var i = 0; i < items.length; i++){
  			if (items[i].postType === 'wanted') {
  				console.log('item', items)
  				filtered.push(items[i])
  			}
  		}
  	return filtered;
  	}
  })
