'use strict';

describe('fcPrimeForm', function () {
  var fcPrimeService, rootScope, el, scope, controller;

  beforeEach(module('fc.directives.prime_form'));
  beforeEach(module('templates'));
  beforeEach(module(function ($provide) {
    $provide.factory('fcPrimeService', function ($q) {
      return {
        getPrimes: function getPrimes(upperLimit) {
          var array, deferred, i;
          array = [];
          deferred = $q.defer();

          for (i = 0; i < upperLimit; i = i + 1) {
            array.push(i);
          }

          deferred.resolve(array);

          return deferred.promise;
        }
      };
    });
  }));

  beforeEach(inject(function ($rootScope, $compile) {
    rootScope = $rootScope;
    el = angular.element('<fc-prime-form></fc-prime-form>');
    $compile(el)(rootScope.$new());
    rootScope.$digest();
    controller = el.controller();
    scope = el.scope();
  }));

  it('should get first 10 primes on init', function (done) {
    expect(scope.showMessage).toBe(false);
    expect(scope.primes.length).toEqual(10);
    rootScope.$apply();
    done();
  });

  it('should get the nth prime if upperLimit is greater than 100000', function (done) {
    scope.calculatePrime(100001);
    scope.$apply();
    expect(scope.showMessage).toBe(true);
    expect(scope.primes).toEqual(100000);
    done();
  });
});
