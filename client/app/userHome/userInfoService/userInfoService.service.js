'use strict';

angular.module('freeNycApp')
  .factory('userInfoService', function ($http) {

    var getInfo = {

      getUserPosts: function(callback) {
        $http.get('/api/userInfos/').success(callback);
      },

      retrieveUser: function(callback){
        $http.get('/api/userInfos/userHome/userProfileInfo/').success(callback);
      },

      initiateTransaction: function(id, temp, callback){
        $http.put('/api/userInfos/initiateTransaction/' + id, temp).success(callback)
      },

      getMyTransactions: function(callback){
        $http.get('/api/userInfos/userHome/listCurrentTransactions/').success(callback);
      },

      rateTransaction: function(id, obj, callback) {
        $http.put('/api/userInfos/rateUser/'+id, obj).success(callback);
      }, 

      abortTransaction: function(postId, obj, callback){
        $http.put('/api/userInfos/abortTransaction/' + postId + '/', obj).success(callback)
      }, 

      retrieveBidsPerUser:  function(callback){
        $http.get('/api/userInfos/userHome/bidsPerUser/').success(callback);
      }
    }

    return getInfo;
  });
