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

      populatePost: function(id, callback){
        $http.put('/api/posts/populateBid/'+ id).success(callback);
      },


      getSinglePost: function(id, callback) {
        $http.get('/api/posts/individualPost/'+id).success(callback);
      },

     

      // abortTransaction: function(postId, obj, callback){
      //   $http.put('/api/posts/abortTransaction/' + postId + '/', obj).success(callback)
      // },

      retrieveBidsPost: function(id, callback){
         $http.put('/api/posts/getPostBids/'+ id + "/").success(callback);
      }, 

      deletePost: function(id, callback){
        $http.delete('/api/posts/' + id).success(callback);
      }
    }

    return makePost;
  });
