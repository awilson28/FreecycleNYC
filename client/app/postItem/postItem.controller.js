'use strict';

angular.module('freeNycApp')
  .controller('PostitemCtrl', function ($scope, $http, $upload, $location, postService, $state) {

  	var vm = this; 

  	$scope.formData = {
  		postTitle: "",
  		crossStreets: "", 
  		description: "",
  		postType: "", 
  		itemType: "Pick Item Type", 
  		keyWords: [], 
  		dimensions: "",
      img: []
  	}

  	$scope.posts; 

    // console.log('user', $scope.getCurrentUser())

  	$scope.tempKeyword = "";

  	vm.OnItemClick = function(event) {
    	$scope.formData.itemType = event;
  	}

  	vm.submitData = function(formData, $valid){
      // console.log('form', formData)
  		// console.log($valid);
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

    vm.myClick = function(value) {
      $scope.formData.postType = value;
    }

    $scope.validateKeywords = function(){
      if ($scope.formData.keyWords.length > 1){
        return true; 
      } else {
        return false; 
      }
     
    }
    // VALIDATION TO BE FIXED
    $scope.$watchCollection('formData.keyWords', function(newVal, oldVal) {
      $scope.PostForm.$setValidity('enoughKeys', newVal.length >= 1);
    });


    
  filepicker.setKey("ADOjYEUgWSnqay1M7j7QDz");
  vm.fpConfig = {
    extensions: ['.jpg', '.jpeg', '.gif', '.png'],
    container: 'modal',
    service: 'COMPUTER'
  };
  vm.onSuccess = function(Blobs){
    $scope.formData.img.push(Blobs[0].url);
  };

  vm.filepicker = filepicker.pickMultiple;

  })
