'use strict';

angular.module('freeNycApp')
  .factory('wishList', function ($http) {

      var wishList = {

        postWishToDb: function(data, callback){
          $http.post('api/users/userHome/newWish/', data).success(callback)
        },

        getWishes: function(callback){
          $http.get('api/users/userHome/allUserWishes/')
        },

        deleteWish: function(id, item, callback){
          $http.delete('api/users/userHome/removeWish/' + id + '/', item).success(callback)
        },

        editWish: function(index, item, callback){
          $http.put('api/users/userHome/changeWish/' + index+ "/", item).success(callback)
        }
      }

      return wishList;
  });
