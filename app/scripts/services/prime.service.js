'use strict';

angular.module('fc.services.prime', [])
  .factory('fcPrimeService', [
    '$rootScope',
    '$q',
    function fcPrimeService($rootScope, $q) {
      var blob, blobURL, worker;

      blob = new Blob(['\
        /**\
         * method that calculates primes using Sieve of Eratosthenes algorithm\
         * @argument {integer} upperLimit to calculate\
         * @returns {Promise}\
         */\
        onmessage = function(e) {\
          var upperLimit, cache, data, booleanArray, primes, i;\
          booleanArray = [];\
          primes = [];\
          data = e.data;\
          upperLimit = data.upperLimit;\
          \
          if (!upperLimit || upperLimit < 2) {\
            return;\
          }\
          \
          for (i = 2; i <= upperLimit + 1; i = i + 1) {\
            booleanArray.push(true);\
          }\
          \
          for (i = 2; i <= booleanArray.length; i = i + 1) {\
            if (booleanArray[i]) {\
              primes.push(i);\
              j = i * i;\
              \
              while (j <= upperLimit) {\
                booleanArray[j] = false;\
                j = j + i;\
              }\
            }\
          }\
          \
          self.postMessage({primes: primes});\
        }\
      ']);

      blobURL = window.URL.createObjectURL(blob);
      worker = new Worker(blobURL);

      worker.postMessage({});

      return {
        worker: worker,
        cache: [],
        lastValue: 2,
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
        _calculatePrimes: function _calculatePrimes(upperLimit) {
          var deferred, booleanArray, primes, i, j, callback, that;
          deferred = $q.defer();
          that = this;

          callback = function callback(e) {
            console.timeEnd('prime');
            that.worker.removeEventListener('message', callback);

            $rootScope.$apply(function () {
              var data = e.data;
              deferred.resolve(data.primes);
            });
          };
          console.time('prime');
          this.worker.addEventListener('message', callback);

          this.worker.postMessage({upperLimit: upperLimit});

          return deferred.promise;
        },
        _addToCache: function _addToCache(primes) {
          this.cache = this.cache.concat(primes);
          this.cache = this.cache.filter(function (value, index, self) {
            return self.indexOf(value) === index;
          }).sort(function (a, b) {
            return a - b;
          });
        },
        _getFromCache: function getFromCache(upperLimit) {
          var lastValue, i, value;

          lastValue = this.lastValue;

          if (!this.cache.length) {
            return false;
          }

          if (lastValue < upperLimit) {
            return false;
          }

          if (lastValue === upperLimit) {
            return this.cache;
          }

          value = this.cache[0];
          i = 0;

          while (value <= upperLimit) {
            value = this.cache[i];
            i = i + 1;
          }

          return this.cache.slice(0, i - 1);
        }
      };
    }
  ]);
