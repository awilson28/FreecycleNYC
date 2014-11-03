'use strict';

angular.module('freeNycApp')
  .factory('postService', function ($http) {
    
    function makePost(){


      this.addToDatabase = function(data, callback){
        $http.post('/api/posts', data).success(callback)
      }

      this.getData = function(callback){
        $http.get('/api/posts').success(callback)
      }

    }



    return new makePost()
  });
