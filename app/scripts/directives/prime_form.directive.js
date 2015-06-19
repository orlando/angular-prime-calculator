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
              $scope.primes = '';
              $rootScope.$emit('spinner.activate');

              if (!upperLimit || upperLimit < 2) {
                return $rootScope.$emit('spinner.deactivate');
              }

              fcPrimeService.getPrimes(upperLimit).then(function (primes) {
                var output, i;
                $scope.showMessage = false
                output = '';

                $rootScope.$emit('spinner.deactivate');

                if (upperLimit > 100000) {
                  $scope.showMessage = true;
                  $rootScope.$emit('primes.change', {value: ''});
                  return $scope.primes = primes[primes.length-1];
                }

                for (i = 0; i < primes.length; i = i + 1) {
                  output += primes[i] + ' ';
                }

                $rootScope.$emit('primes.change', {value: output});
              });
            };

            $scope.calculatePrime($scope.prime.upperLimit);
          }
        ],
        link: function link($scope, element, attrs) {
          var unwatch;

          unwatch = $rootScope.$on('primes.change', function (event, data) {
            document.getElementById("prime-container").innerHTML = data.value;
          })

          $scope.$on('$destroy', function () {
            unwatch();
          })
        },
        template: '\
          <div class="container">\
            <div class="jumbotron">\
              <h2>Prime Numbers Calculator</h2>\
              <form ng-submit="calculatePrime(prime.upperLimit)" novalidate>\
                <div class="form-group">\
                  <input name="upperLimit" ng-model="prime.upperLimit" ng-value="3" type="number" class="form-control" placeholder="Upper Limit" min="2" max="10000000" step="1" required>\
                </div>\
                <button type="submit" class="btn btn-lg btn-success">Calculate</button>\
              </form>\
            </div>\
            <div class="prime-list">\
              <h2 ng-if="showMessage">Last prime is {{::primes}}</h2>\
              <div id="prime-container">\
              </div>\
            </div>\
          </div>\
        ',
        replace: true
      };
    }
  ]);
