'use strict';

angular.module('freeNycApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $http) {
    $scope.errors = {};

    // var vm = this; 

    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};

    $scope.destroyAccount = function(){
      var id = Auth.getCurrentUser()._id; 
      $http.delete('api/userInfos/' + id).success(function(result){
        console.log('deleted user', result)
      })
    }
    
  });
