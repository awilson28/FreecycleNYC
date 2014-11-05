'use strict';

angular.module('freeNycApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',  
  'ui.utils',
  'angularFileUpload'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('allItems', {
        url: '/home', 
        templateUrl: 'app/allItems/allItems.html', 
        controller: 'AllitemsCtrl as items'
      })
      .state('postItem', {
        url: '/post_an_item',
        templateUrl: 'app/postItem/postItem.html', 
        controller: 'PostitemCtrl as postItem' 
      })
      .state('userHome', {
        url: '/userHome',
        templateUrl: 'app/userHome/userHome.html',
        controller: 'UserhomeCtrl as user'
      });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });