'use strict';

angular.module('freeNycApp')
  .controller('AllitemsCtrl', function ($scope, postService) {
	
	var vm = this; 

	postService.getData(function(results){
		$scope.allPosts = results;
	})   



  });
