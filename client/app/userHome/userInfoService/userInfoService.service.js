'use strict';

angular.module('freeNycApp')
  .factory('userInfoService', function ($http) {

    function getInfo() {

      this.getUserPosts = function(callback) {
        $http.get('/api/userInfos/').success(callback);
      }

      this.retrieveUser = function(callback){
        $http.get('api/userInfos/getUser/').success(callback);
      }

    }

    return new getInfo();
  });
