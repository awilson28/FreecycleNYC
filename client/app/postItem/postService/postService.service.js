'use strict';

angular.module('freeNycApp')
  .factory('postService', function ($http) {
    
    var makePost = {


      addToDatabase:  function(data, callback){
        $http.post('/api/posts/', data).success(callback);
      },

      getData: function(callback, paginationData){
        // paginationData = paginationData || {skip: 0}
        // {params: paginationData}
        $http.get('/api/posts/').success(callback);
      },

      filterData:  function(keyword){
        return $http.get('/api/posts/' + keyword).then(function received(results){
          return results.data;
        })
      },

      deletePost: function(id, callback){
        $http.delete('/api/posts/' + id).success(callback);
      },

      updatePost:  function(id, data, callback) {
        $http.put('/api/posts/'+id, data).success(callback);
      },

      populatePost: function(id, callback){
        $http.put('/api/posts/populateBid/'+ id).success(callback);
      },


      getSinglePost: function(id, callback) {
        console.log(id);
        $http.get('/api/posts/individualPost/'+id).success(callback);
      },

      enableRatings:  function(id, obj, callback){
        $http.put('/api/posts/enableRatings/' + id + "/", obj).success(callback)
      },

      // abortTransaction: function(postId, obj, callback){
      //   $http.put('/api/posts/abortTransaction/' + postId + '/', obj).success(callback)
      // },

      retrieveBidsPost: function(id, callback){
         $http.put('/api/posts/getPostBids/'+ id + "/").success(callback);
      }
    }

    return makePost;
  });
