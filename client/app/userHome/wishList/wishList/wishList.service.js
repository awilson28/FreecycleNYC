'use strict';

angular.module('freeNycApp')
  .factory('wishList', function ($http) {

      var wishList = {

        postWishToDb: function(data, callback){
          $http.post('api/users/wish/', data).success(callback)
        },

        getWishes: function(callback){
          $http.get('api/users/getWishes/')
        },

        deleteWish: function(id, item, callback){
          console.log('in here')
          $http.put('api/users/updateWishList/' + id, item).success(callback)
        },

        editWish: function(index, item, callback){
          $http.put('api/users/changeWish/' + index+"/", item).success(callback)
        }

      }

      return wishList()
  });
