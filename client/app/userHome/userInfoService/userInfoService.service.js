'use strict';

angular.module('freeNycApp')
  .factory('userInfoService', function ($http) {

    var getInfo = {

      getUserPosts: function(callback) {
        $http.get('/api/userInfos/').success(callback);
      },

      retrieveUser: function(callback){
        $http.get('/api/userInfos/userProfileInfo/').success(callback);
      },

      initiateTransaction: function(id, temp, callback){
        $http.put('/api/userInfos/initiateTransaction/' + id, temp).success(callback)
      },

      getMyTransactions: function(callback){
        $http.get('/api/userInfos/listCurrentTransactions/').success(callback);
      },

      rateTransaction: function(id, obj, callback) {
        $http.put('/api/userInfos/rateUser/'+id, obj).success(callback);
      }
    }

    return getInfo;
  });
