'use strict';

angular.module('freeNycApp')
  .controller('PostitemCtrl', function ($scope, postService, $state) {

  	var vm = this; 

  	$scope.formData = {
  		postTitle: "",
  		crossStreets: "", 
  		description: "",
  		postType: "", 
  		itemType: "Pick Item Type", 
  		keyWords: [], 
  		dimensions: "" 
  	}

  	$scope.posts; 

  	$scope.tempKeyword = "";

  	vm.OnItemClick = function(event) {
    	$scope.formData.itemType = event;
  	}

  	vm.submitData = function(formData, $valid){
  		console.log($valid);
  		if ($valid) {
  			postService.addToDatabase(formData, vm.displayData);
  		}
  	}

  	vm.displayData = function() {
  		// postService.getData(function() {
  			$state.go('allItems');
  		// })
  	}

  	vm.addKeyWord = function(word){
  		$scope.formData.keyWords.push(word);
  		$scope.tempKeyword = "";
  	}

  });
