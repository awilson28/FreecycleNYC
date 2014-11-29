'use strict';

angular.module('freeNycApp')
  .controller('MessagesCtrl', function ($scope, Auth, socket, messageService, $state) {
    
    var vm = this;
    $scope.newMessage = {
    	body: "", 
        sender: {},
        recipient: {}
    }; 
    $scope.showMe = {};
    $scope.userId = Auth.getCurrentUser()._id;
    $scope.numMessages = Auth.getCurrentUser().numMessages
    var data = {
        userId: $scope.userId, 
        roomId: messageService.convoId.convoId
    }

    console.log('numMessages', $scope.numMessages)
    //gets all messages for the signed in user
  //   messageService.getMyMessages(function(data) {
		// $scope.communication = data;
  //       for (var i = 0; i < $scope.communication.length; i++) {
  //           var temp = $scope.communication[i].conversants;
  //           for (var j = 0; j < temp.length; j++) {
  //               if(temp[j]._id !== $scope.userId) {
  //                  $scope.communication[i].conversants = temp[j];
  //               }
  //           };
  //       };
  //   });

    socket.socket.emit('getMessages', data)
    socket.socket.on('allMessages', function(data){
        $scope.communication = data; 
        for (var i = 0; i < $scope.communication.length; i++) {
            var temp = $scope.communication[i].conversants;
            for (var j = 0; j < temp.length; j++) {
                if(temp[j]._id !== $scope.userId) {
                   $scope.communication[i].conversants = temp[j];
                }
            };
        };
    })

    //click event that displays the message field so the user can respond
    vm.replyButton = function(index, parentIndex){
        $scope.showMe[parentIndex][index] = true;
    }

    //click event that adds user's response to the messages array in the communication
    vm.reply = function(convoId, index, parentIndex){
        console.log('indexparams', index, parentIndex)
        console.log('index', $scope.communication[parentIndex].messages[index])
        if ($scope.userId === $scope.communication[parentIndex].messages[index].recipient._id) {
            $scope.newMessage.sender._id = $scope.userId; 
            $scope.newMessage.recipient._id = $scope.communication[parentIndex].messages[index].sender._id;
            $scope.newMessage.recipient.name = $scope.communication[parentIndex].messages[index].sender.name;
            // console.log('userId', $scope.userId, 'convo', $scope.communication[parentIndex].message[index])
        }
        else if ($scope.userId === $scope.communication[parentIndex].messages[index].sender._id) {
            $scope.newMessage.recipient._id = $scope.userId; 
            $scope.newMessage.sender._id = $scope.communication[parentIndex].messages[index].recipient._id
            $scope.newMessage.sender.name = $scope.communication[parentIndex].messages[index].recipient.name

            // console.log('userId', $scope.userId, 'convo', $scope.communication[parentIndex].message[index])

        }
        $scope.newMessage.convoId = convoId;
        //convoId is the id of the room 
        $scope.newMessage.roomId = messageService.convoId.convoId; 

        console.log('response: ', $scope.newMessage)
        // console.log('new message', $scope.newMessage)
    	// messageService.replyToMessage(convoId, $scope.newMessage, function(result){
     //        $scope.showMe[parentIndex][index] = false;
    	// })

        socket.socket.emit('reply', $scope.newMessage)
        console.log('reply: ', $scope.newMessage)
        socket.socket.on('replySent', function(data){
            $scope.showMe[parentIndex][index] = false; 
            console.log('replySent', data)
        })
    }


    //sets showMe to true 
    vm.showMessages = function(index, talkId) {
        if($scope.showMe[index] === undefined) {
            $scope.showMe[index] = {show: undefined}
        }
        if($scope.showMe[index].show === true) {
            $scope.showMe[index].show = false;
        } else {$scope.showMe[index].show = true;}

        // console.log('convo id', talkId)
        //make sure this function is properly using index
        var obj = {
            talkId: talkId,
            userId: $scope.userId, 
            roomId: messageService.convoId.convoId
        }

        socket.socket.emit('displayMessages', obj)
        socket.socket.on('convoUpdated', function(result){
            if ($scope.communication[index].numNewMessages > 0){
                $scope.communication[index].numNewMessages = result.numMessages;
                if($scope.numMessages > 0){
                    $scope.numMessages -= 1; 
                }
            }
        })

        // messageService.adjustNumNewMessages(talkId, function(result){
        //     if ($scope.communication[index].numNewMessages > 0){
        //         $scope.communication[index].numNewMessages = result.numMessages;
        //         if($scope.numMessages > 0){
        //             $scope.numMessages -= 1; 
        //         }
        //     }
        // })
    }
});
      