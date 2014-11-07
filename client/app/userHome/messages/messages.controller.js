'use strict';

angular.module('freeNycApp')
  .controller('MessagesCtrl', function ($scope, Auth, messageService, $state) {
    
    var vm = this;
    $scope.newMessage = {
    	body: ""
    }; 
    $scope.showMe = {}; 


    //gets all messages for the signed in user
    messageService.getMyMessages(function(data) {
    	console.log(data[0]);
		$scope.communication = data;
		console.log('talk', $scope.communication)
    });

    //click event that displays the message field so the user can respond
    vm.replyButton = function(index, parentIndex){
    	// $scope.correspondence[index] = true; 
    	$scope.showMe[parentIndex][index] = true;
    }

    //click event that adds user's response to the messages array in the communication
    vm.reply = function(convoId){
    	messageService.replyToMessage(convoId, $scope.newMessage, function(result){
    	})
    }

    //sets showMe to true 
    vm.showMessages = function(index) {
    	$scope.showMe[index] = {display: true, reply: false};
    }


    // vm.seeSingleConvo = function(index){
    // 	$scope.singleConversation = $scope.communication[index]
    // 	// $state.go('userHome.singleConversationView')
    // }


  });
      