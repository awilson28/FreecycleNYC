'use strict';

angular.module('freeNycApp')
  .factory('postService', function ($http) {
    
    var makePost = {

      //adds the form data to the database to create post
      addToDatabase:  function(data, callback){
        $http.post('/api/posts/', data).success(callback);
      },

      //retrieves all posts 
      getData: function(callback, paginationData){
        // paginationData = paginationData || {skip: 0}
        // {params: paginationData}
        $http.get('/api/posts/').success(callback);
      },

      //returns posts that match keywords using text index on the back end
      filterData:  function(keyword){
        return $http.get('/api/posts/' + keyword).then(function received(results){
          return results.data;
        })
      },

      //adds user ids to the bids array on a post 
      populatePost: function(id, callback){
        $http.put('/api/posts/populateBid/'+ id).success(callback);
      },

      //retrieves a single post
      getSinglePost: function(id, callback) {
        $http.get('/api/posts/individualPost/'+id).success(callback);
      },

      deletePost: function(id, callback){
        $http.delete('/api/posts/' + id).success(callback);
      }
    }

    return makePost;
  });
