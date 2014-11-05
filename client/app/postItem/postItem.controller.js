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
    $scope.Blobs = []; 

    // console.log('user', $scope.getCurrentUser())

  	$scope.tempKeyword = "";

  	vm.OnItemClick = function(event) {
    	$scope.formData.itemType = event;
  	}

  	vm.submitData = function(formData, $valid){
      // console.log('form', formData)
  		// console.log($valid);
  		if ($valid && $scope.formData.keyWords.length > 0) {

        formData.crossStreets = formData.crossStreets + " " + formData.zipCode
        delete formData.zipCode

        console.log('form', formData)

  			postService.addToDatabase(formData, vm.displayData);
  		}
      else {
        alert('form is invalid')
      }
  	}

  	vm.displayData = function() {
  			$state.go('allItems');
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

    //delete functionality 
    vm.deleteImage = function(index){
      filepicker.remove($scope.Blobs[index], function(){
        console.log('index', $scope.Blobs[index])
        $scope.formData.img.splice(index, 1);
        $scope.$apply();
      })
    }

    // VALIDATION TO BE FIXED
    $scope.$watchCollection('formData.keyWords', function(newVal, oldVal) {
      $scope.PostForm.$setValidity('enoughKeys', newVal.length >= 1);
    });


    
  filepicker.setKey("ADOjYEUgWSnqay1M7j7QDz");
  vm.fpConfig = {
    extensions: ['.jpg', '.jpeg', '.gif', '.png'],
    container: 'modal',
    service: 'COMPUTER', 
    maxSize: 1024 * 1024 * 3
  };
  vm.onSuccess = function(Blobs){
    for (var i=0, len=Blobs.length; i<len; i++) {
      $scope.formData.img.push(Blobs[i].url);
      $scope.Blobs.push(Blobs[i]);
      $scope.$apply();
    }
  };

  vm.filepicker = filepicker.pickMultiple;

  })
