'use strict';

angular.module('freeNycApp')
  .factory('userInfoService', function ($http) {

    function getInfo() {

      this.getUserPosts = function(callback) {
        $http.get('/api/userInfos/').success(callback);
      }

      this.retrieveUser = function(callback){
        $http.get('/api/userInfos/getUser/').success(callback);
      }

      this.initiateTransaction = function(id, postId, callback){
        $http.put('/api/userInfos/initiateTransaction/' + id, {id: postId}).success(callback)
      }

      this.getMyTransactions = function(callback){
        $http.get('/api/userInfos/getTransactions').success(callback);
      }

      this.rateTransaction = function(id, rating, callback) {
        $http.put('/api/userInfos/rateUser/'+id, {'rating': rating}).success(callback);
      }

    }

    return new getInfo();
  });
