'use strict';

angular.module('freeNycApp')
  .controller('PostitemCtrl', function ($scope, $http, upload, $location, postService, $state) {

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

    $scope.$watchCollection('formData.keyWords', function(newVal, oldVal) {
      $scope.PostForm.$setValidity('enoughKeys', newVal.length >= 1);
    });
   // $scope.onFileSelect = function($files) {
   //  console.log('in event')
   //  //$files: an array of files selected, each file has name, size, and type.
   //  console.log('files', $files)
   //  // for (var i = 0; i < $files.length; i++) {
   //  //   var $file = $files[i];
   //  //     $http.uploadFile({
   //  //       url: 'server/upload/url', //upload.php script, node.js route, or servlet uplaod url)
   //  //       data: {myObj: $scope.myModelObj},
   //  //       file: $file
   //  //     }).then(function(data, status, headers, config) {
   //  //    // file is uploaded successfully
   //  //   console.log(data);
   //  //   }); 
   //  //  }
   //  }

  //  $scope.doUpload = function(files) {
  //   console.log('files', files)
  //   upload({
  //     url: '/api/posts',
  //     data: {
  //       anint: 123,
  //       aBlob: Blob([1,2,3]), // Only works in newer browsers
  //       aFile: $scope.myFile, // a jqLite type="file" element, upload() will extract all the files from the input and put them into the FormData object before sending.
  //     }
  //   }).then(
  //     function (response) {
  //       console.log(response.data); // will output whatever you choose to return from the server on a successful upload
  //     },
  //     function (response) {
  //         console.error(response); //  Will return if status code is above 200 and lower than 300, same as $http
  //     });
  // }

  $scope.add = function(){
  var f = document.getElementById('file').files[0],
      r = new FileReader();
      console.log('f', f)
      $scope.formData.image = f; 

  // r.onloadend = function(e){
  //   var data = e.target.result;
  //   console.log('data', data)
    //send you binary data via $http or $resource or do anything else with it
  // }
  // r.readAsArrayBuffer(f);
}


  })
