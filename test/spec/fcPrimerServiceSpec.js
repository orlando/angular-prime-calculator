'use strict';

describe('fcPrimeService', function () {
  var fcPrimeService, rootScope;

  beforeEach(module('fc.services.prime'));

  beforeEach(inject(function (_fcPrimeService_, $rootScope) {
    fcPrimeService = _fcPrimeService_;
    rootScope = $rootScope;
  }));

  it('should get first 5 primes', function (done) {
    fcPrimeService.getPrimes(5)
      .then(function (primes) {
        expect(primes).toEqual([2,3,5,7,11]);
        done();
      });

    rootScope.$digest();
  });

  it('should get first 10 primes', function (done) {
    fcPrimeService.getPrimes(10)
      .then(function (primes) {
        expect(primes).toEqual([2,3,5,7,11,13,17,19,23,29]);
        done();
      });

    rootScope.$digest();
  });
});
