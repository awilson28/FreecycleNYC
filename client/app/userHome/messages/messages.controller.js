'use strict';

angular.module('freeNycApp')
  .controller('MessagesCtrl', function ($scope, Auth, $rootScope, $cookieStore, socket, messageService, $state) {
    

    var vm = this;
    $scope.newMessage = {
    	body: "", 
        sender: {},
        recipient: {}
    }; 
    $scope.showMe = {};


    //this hopefully solves an async issue that we'll have once we deploy to heroku
    //though we do not currently experience this issue 
    var foo = function(){
        if (Auth.getCurrentUser().name){
            console.log('hitting foo: ', Auth.getCurrentUser().name)
            $scope.userId = Auth.getCurrentUser()._id; 
            $scope.userName = Auth.getCurrentUser().name; 
            $scope.numMessages = Auth.getCurrentUser().numMessages
        }
    }

    foo(); 

    $rootScope.$on('user:loggedIn', function(){
        console.log('-------------------------')
        foo(); 
    })

    // $scope.userId = Auth.getCurrentUser()._id;
    // $scope.userName = Auth.getCurrentUser().name; 
    var data = {
        userId: $scope.userId, 
        roomId: messageService.convoId.convoId
    }

    $scope.conversants = []; 
    $scope.displayConversants = ''; 

    // console.log('numMessages', $scope.numMessages)

    vm.getMessages = function(){
        socket.socket.emit('getMessages', data)
    }
    
    vm.getMessages()

    socket.socket.on('allMessages', function(data){
        console.log('in here!!')
        $scope.communication = data;
        for (var i = 0; i < $scope.communication.length; i++) {
            if($scope.userName !== $scope.communication[i].messages[0].recipient.name){
                messageService.conversantNames.talkingTo = $scope.communication[i].messages[0].recipient.name  
                $scope.communication[i].talkingTo = messageService.conversantNames.talkingTo
                // console.log('talking with: ', $scope.communication[i].messages[$scope.communication[i].messages.length-1])
                // console.log('talkingto: ', $scope.communication[i].talkingTo)              
            } else {
                messageService.conversantNames.talkingTo = $scope.communication[i].messages[0].sender.name 
                console.log('sender: ', $scope.communication[i].messages[0])
                $scope.communication[i].talkingTo = messageService.conversantNames.talkingTo
                // console.log('talkingto: ', $scope.communication[i].talkingTo)                             
            }
        };
    })

    //click event that displays the message field so the user can respond
    vm.replyButton = function(index, parentIndex){
        $scope.showMe[parentIndex][index] = true;
    }

    //click event that adds user's response to the messages array in the communication
    vm.reply = function(convoId, index, parentIndex){

        // $scope.conversants.push($scope.communication[0].messages[0].recipient._id, 
        //     $scope.communication[0].messages[0].sender._id)
        // messageService.conversants = $scope.conversants

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
    }

});
      