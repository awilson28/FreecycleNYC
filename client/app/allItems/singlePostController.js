'use strict';

angular.module('freeNycApp')
  .controller('singlePostController', function ($scope, Auth, postService, $stateParams) {
  	var vm = this; 

    postService.getSinglePost($stateParams.id, function(data) {
      $scope.post = data;
    })

  });