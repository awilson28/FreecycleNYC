'use strict';

angular.module('freeNycApp')
  .factory('messageService', function ($http) {
    function messageService() {

      this.getMyMessages = function(callback) {
        $http.get('api/things/getMessages/').success(callback);
      };

      this.deleteMessage = function(messageId) {

      };

      this.replyToMessage = function(id, messageBody, callback) {
        console.log('id', id)
        $http.put('api/things/reply/' + id, messageBody).success(callback);
      };

      this.sendMessage = function(message, callback) {
        $http.post('api/things/', message).success(callback);
      };
    }

    return new messageService;
  
  });
