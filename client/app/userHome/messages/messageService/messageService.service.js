'use strict';

angular.module('freeNycApp')
  .factory('messageService', function ($http) {
    var messageService = {

      convoId: {
        convoId: ''
      },

      conversants: [],

      conversantNames: {
        talkingTo: ''
      }

      // this.getMyMessages = function(callback) {
      //     $http.get('api/things/getMessages/').success(callback);
      //   };

      // this.getMyMessages = function(callback) {
      //   return $http.get('api/things/getMessages/').then(function(response){
      //     return response.data; 
      //   })
      // };

      // this.replyToMessage = function(id, messageBody, callback) {
      //   console.log('id', id)
      //   $http.put('api/things/reply/' + id, messageBody).success(callback);
      // };

      // this.sendMessage = function(message, callback) {
      //     $http.post('api/things/', message).success(callback);
      // };

      // this.adjustNumNewMessages = function(talkId, callback){
      //   console.log('id', talkId)
      //   $http.put('/api/things/adjustNumNewMessages/' + talkId + "/").success(callback)
      // }
    }

    return messageService;
  
  });
