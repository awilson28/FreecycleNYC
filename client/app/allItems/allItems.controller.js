'use strict';

angular.module('freeNycApp')
  .controller('AllitemsCtrl', function ($scope, postService) {
	
	var vm = this; 
	var keyword = 'blue'; 

	postService.getData(function(results){
		$scope.allPosts = results;
	})   

	postService.filterData(keyword, function(results){
		$scope.filteredData = results; 
	});


  });
