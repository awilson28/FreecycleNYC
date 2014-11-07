'use strict';

describe('Controller: WishlistCtrl', function () {

  // load the controller's module
  beforeEach(module('freeNycApp'));

  var WishlistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WishlistCtrl = $controller('WishlistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
