'use strict';

angular.module('freeNycApp')
  .controller('singlePostController', function ($scope, Auth, $rootScope, socket, postService, messageService, $stateParams) {
  	var vm = this;

	  var foo = function(){
			if (Auth.getCurrentUser().name){
				$scope.user = Auth.getCurrentUser()._id; 
				$scope.userEmail = Auth.getCurrentUser().email; 
			}
		}

	  foo(); 

	  $rootScope.$on('user:loggedIn', function(){
	    console.log('-------------------------')
	    foo(); 
	  })

	  $scope.biddedOn = {};
		$scope.bidPressed = {};
		$scope.messageArray = [];
		$scope.messageForm = {};

		console.log('state id: ', $stateParams.id)

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
			$scope.messageForm[index] = false; 
			console.log('recipient: ', recipient);
			$scope.messageArray[index].recipient = recipient;
			//added this line because with sockets, we cannot access the current user id with req.user._id
			$scope.messageArray[index].sender = $scope.user; 
			$scope.messageArray[index].email = $scope.userEmail; 

			//create the socket room id 
			messageService.convoId.convoId = $scope.messageArray[index].recipient + $scope.user;
			$scope.messageArray[index].roomId = messageService.convoId.convoId;

			console.log('convo id: ', messageService.convoId.convoId)
			
			//message sent via sockets 
			socket.socket.emit('sendMessage', $scope.messageArray[index])
			socket.socket.on('MessageSent', function(data){
				$scope.bidPressed[index] = true; 
				console.log('data: ', data)
			})
		}
  });