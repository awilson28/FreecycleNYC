'use strict';

describe('Service: userInfoService', function () {

  // load the service's module
  beforeEach(module('freeNycApp'));

  // instantiate service
  var userInfoService;
  beforeEach(inject(function (_userInfoService_) {
    userInfoService = _userInfoService_;
  }));

  it('should do something', function () {
    expect(!!userInfoService).toBe(true);
  });

});
