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

      this.filterData = function(keyword, callback){
        $http.get('/api/posts/' + keyword).success(callback)   
      }

      this.deletePost = function(id, callback){
        $http.delete('/api/posts/' + id).success(callback)
      }

    }



    return new makePost()
  })
  .service('fileUpload', ['$http', function($http){

    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
  }])
