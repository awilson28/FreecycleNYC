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
  		keywords: "", 
  		dimensions: "" 
  	}

  	$scope.posts; 

  	// this.myClick = function(){
  	// 	if ($scope.formData.listType.offerSelected === true){

  	// 	}
  	// }

  	// $scope.selectedItem = "Items";

  	this.OnItemClick = function(event) {
    	$scope.formData.itemType = event;
  	}

  	this.submitData = function(formData){
  		postService.addToDatabase(formData, vm.displayData)
  	}

  	this.displayData = function() {
  		// postService.getData(function() {
  			$state.go('allItems')
  		// })
  	}

  });
