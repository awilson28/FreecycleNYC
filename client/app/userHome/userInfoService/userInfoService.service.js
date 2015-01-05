'use strict';

angular.module('freeNycApp')
  .factory('userInfoService', function ($http) {

    //These are api calls that are made from the User Home Page

    var userHomeInfo = {

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

      enableRatings:  function(id, obj, callback){
        $http.put('/api/userInfos/userOffers/enableRatings/' + id + "/", obj).success(callback)
      },

      updatePost:  function(id, data, callback) {
        $http.put('/api/userInfos/userHome/modifyPost/'+id, data).success(callback);
      },

      rateTransaction: function(id, obj, callback) {
        $http.put('/api/userInfos/rateUser/'+id, obj).success(callback);
      }, 

      abortTransaction: function(postId, obj, callback){
        $http.put('/api/userInfos/abortTransaction/' + postId + '/', obj).success(callback)
      }, 

      retrieveBidsPerUser:  function(callback){
        $http.get('/api/userInfos/userHome/bidsPerUser/').success(callback);
      }, 

      namesOfBiddersOnPost: function(id, callback){
         $http.put('/api/userInfos/userOffers/populateBidArray/'+ id + "/").success(callback);
      } 
    }

    return userHomeInfo;
  });
