'use strict';

angular.module('fc.services.prime', [])
  .factory('fcPrimeService', [
    '$rootScope',
    '$q',
    function fcPrimeService($rootScope, $q) {
      var worker, workerPath;

      workerPath = 'app/scripts/worker.js';

      // Karma prepends 'base' to all scripts paths
      // since this is not included in the build
      // we need to this in order to get it working
      // https://github.com/karma-runner/karma/issues/1302
      if (typeof window.__karma__ !== 'undefined') {
        workerPath = 'base/' + workerPath;
      }

      worker = new Worker(workerPath);
      worker.postMessage({});

      return {
        worker: worker,
        cache: [],
        lastValue: 2,
        /**
         * Public method to get nth primes
         * @param {Number} upperLimit the nth prime to calculate
         * @returns {Promise}
         */
        getPrimes: function getPrimes(upperLimit) {
          var deferred, that, cached;
          that = this;
          deferred = $q.defer();

          cached = this._getFromCache(upperLimit);

          if (cached) {
            deferred.resolve(cached);
          } else {
            this._calculatePrimes(upperLimit)
              .then(function (primes) {
                that._addToCache(primes);

                if (that.lastValue < upperLimit) {
                  that.lastValue = upperLimit;
                }

                deferred.resolve(that._getFromCache(upperLimit));
              });
          }

          return deferred.promise;
        },
        /**
         * Calculates primes using a worker
         * @param {Number} upperLimit the nth prime to calculate
         * @returns {Promise}
         */
        _calculatePrimes: function _calculatePrimes(upperLimit) {
          var deferred, booleanArray, primes, i, j, callback, that;
          deferred = $q.defer();
          that = this;

          callback = function callback(e) {
            that.worker.removeEventListener('message', callback);

            $rootScope.$apply(function () {
              var data = e.data;
              deferred.resolve(data.primes);
            });
          };

          this.worker.addEventListener('message', callback);
          this.worker.postMessage({upperLimit: upperLimit});

          return deferred.promise;
        },
        /**
         * Adds calculated primes to cache
         * @param {Array} primes Array of primes
         * @returns {undefined}
         */
        _addToCache: function _addToCache(primes) {
          this.cache = this.cache.concat(primes);
          this.cache = this.cache.filter(function (value, index, self) {
            return self.indexOf(value) === index;
          }).sort(function (a, b) {
            return a - b;
          });
        },
        /**
         * Adds calculated primes to cache
         * @param {Array} primes Array of primes
         * @returns {Boolean|Array} false in case primes is not in the list, otherwise an array
         */
        _getFromCache: function getFromCache(upperLimit) {
          if (this.cache.length === 0) {
            return false;
          }

          if (this.cache.length < upperLimit) {
            return false;
          }

          if (this.cache.length === upperLimit) {
            return this.cache;
          }

          return this.cache.slice(0, upperLimit);
        }
      };
    }
  ]);
