'use strict';

angular.module('freeNycApp')
  .controller('PostitemCtrl', function ($scope, $http, Auth, $location, postService, $state) {
  	var vm = this; 

  	$scope.formData = {
  		postTitle: "",
  		crossStreets: "", 
  		description: "",
  		postType: "", 
  		itemType: "Pick Item Type", 
  		keyWords: [], 
  		dimensions: "",
      img: [], 
      taken: false,
      fulfilled: true
  	}

  	$scope.posts;
    $scope.Blobs = []; 


  	$scope.tempKeyword = "";

    //click event that sets the item type listed in the drop down menu as the main menu item
  	vm.OnItemClick = function(event) {
    	$scope.formData.itemType = event;
  	}

    //sends the form data to the database for creation and save 
  	vm.submitData = function(formData, $valid){
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

    //
  	vm.displayData = function() {
  			$state.go('allItems');
  	}

    //click event that adds keywords to the display and to the keywords array 
  	vm.addKeyWord = function(word){
  		$scope.formData.keyWords.push(word);
  		$scope.tempKeyword = "";
    }

    //click event that sets the postType key of the form object to either 'wanted' or 'offered'
    //based on the radio box check
    vm.myClick = function(value) {
      $scope.formData.postType = value;
    }

    //validates keywords to ensure that at least one keyword is added to the array 
    $scope.validateKeywords = function(){
      if ($scope.formData.keyWords.length > 0){
        return true; 
      } else {
        return false; 
      }
    }

    //delete image functionality 
    vm.deleteImage = function(index){
      filepicker.remove($scope.Blobs[index], function(){
        $scope.formData.img.splice(index, 1);
        $scope.Blobs.splice(index, 1);
        $scope.$apply();
      })
    }

    //remove keyword functionality
    vm.dropKeyword = function(index) {
      $scope.formData.keyWords.splice(index, 1)
    }

    // VALIDATION TO BE FIXED
    $scope.$watchCollection('formData.keyWords', function(newVal, oldVal) {
      $scope.PostForm.$setValidity('enoughKeys', newVal.length >= 1);
    });



  /////// FILE PICKER FUNCTIONALITY FOR UPLOADING IMAGES //////////////////
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
    console.log('success Blobs', $scope.Blobs)
  };

  vm.filepicker = filepicker.pickMultiple;

  })
