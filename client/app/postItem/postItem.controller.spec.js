'use strict';

describe('Controller: PostitemCtrl', function () {

  // load the controller's module
  beforeEach(module('freeNycApp'));

  var PostitemCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostitemCtrl = $controller('PostitemCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
