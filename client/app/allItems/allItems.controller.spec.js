'use strict';

describe('Controller: AllitemsCtrl', function () {

  // load the controller's module
  beforeEach(module('freeNycApp'));

  var AllitemsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllitemsCtrl = $controller('AllitemsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
