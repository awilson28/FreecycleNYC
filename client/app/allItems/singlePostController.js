'use strict';

angular.module('freeNycApp')
  .controller('singlePostController', function ($scope, Auth, postService, messageService, $stateParams) {
  	var vm = this;

	  $scope.biddedOn = {};
		$scope.bidPressed = {};
		$scope.messageArray = [];
		$scope.messageForm = {};

    postService.getSinglePost($stateParams.id, function(data) {
      $scope.post = data;
    })

	  //click event that triggers a put request to add the user to the bids array
		//click event that displays the message form for items on the home page - message sent
		//with bid request
		vm.bidOnItem = function(id, userId, index){
			$scope.biddedOn[index] = true;
			$scope.messageForm[index] = true;
			postService.populatePost(id, function(result){
				console.log('bid', result);
			})
		}

		// vm.showMessageForm = function(index) {
			
		// }

		//click event that sends a message to the owner of the item 
		vm.sendMessage = function(recipient, index) {
			console.log(recipient);
			$scope.messageArray[index].recipient = recipient;
			messageService.sendMessage($scope.messageArray[index], function(data) {
				$scope.messageForm[index] = false;
				$scope.bidPressed[index] = true;
			})
		}

  });