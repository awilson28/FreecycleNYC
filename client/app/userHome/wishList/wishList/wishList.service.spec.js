'use strict';

describe('Service: wishList', function () {

  // load the service's module
  beforeEach(module('freeNycApp'));

  // instantiate service
  var wishList;
  beforeEach(inject(function (_wishList_) {
    wishList = _wishList_;
  }));

  it('should do something', function () {
    expect(!!wishList).toBe(true);
  });

});
