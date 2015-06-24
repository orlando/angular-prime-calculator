'use strict';

angular.module('fc.directives.prime_form', [])
  .directive('fcPrimeForm', [
    '$rootScope',
    function fcPrimeForm($rootScope) {
      return {
        attribute: 'E',
        controller: [
          '$scope',
          '$rootScope',
          'fcPrimeService',
          function ($scope, $rootScope, fcPrimeService) {
            $scope.primes = [];

            $scope.prime = {
              upperLimit: 10
            };

            $scope.calculatePrime = function calculatePrime(upperLimit) {
              $rootScope.$emit('spinner.activate');

              if (!upperLimit || upperLimit < 2) {
                return $rootScope.$emit('spinner.deactivate');
              }

              fcPrimeService.getPrimes(upperLimit).then(function (primes) {
                var output;
                $scope.showMessage = false;
                output = '';

                $rootScope.$emit('spinner.deactivate');

                if (upperLimit > 100000) {
                  $scope.showMessage = true;
                  return $scope.primes = primes[primes.length-1];
                }

                $scope.primes = primes;
              });
            };

            $scope.calculatePrime($scope.prime.upperLimit);
          }
        ],
        link: function link($scope, element, attrs) {
        },
        templateUrl: '/templates/prime_form.directive.html',
        replace: true
      };
    }
  ]);
