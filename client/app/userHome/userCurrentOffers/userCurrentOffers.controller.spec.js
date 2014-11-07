'use strict';

describe('Controller: UsercurrentoffersCtrl', function () {

  // load the controller's module
  beforeEach(module('freeNycApp'));

  var UsercurrentoffersCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsercurrentoffersCtrl = $controller('UsercurrentoffersCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
