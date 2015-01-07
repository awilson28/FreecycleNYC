'use strict';

angular.module('freeNycApp')
  .factory('messageService', function ($http) {
    var messageService = {

      room: {
        convoId: ''
      },

      conversantNames: {
        talkingTo: ''
      }, 

      messages: {
        render: []
      }
    }

    return messageService;
  
  });
