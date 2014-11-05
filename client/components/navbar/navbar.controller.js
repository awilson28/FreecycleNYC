'use strict';

angular.module('freeNycApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.menu = [
    {
      'title': 'Home',
      'link': '/home'
    },
    {
      'title': 'Post',
      'link': '/post_an_item'
    },
    {
      'title': 'User Home',
      'link': '/userHome'
    }
    ];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });