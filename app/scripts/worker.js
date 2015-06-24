/*global self */
/**
 * method that calculates primes using Sieve of Eratosthenes algorithm
 * @argument {integer} upperLimit to calculate
 * @returns {Promise}
 */
if (self) {
  onmessage = function onmessage(e) {
    'use strict';
    var upperLimit, powUpperLimit, data, booleanArray, primes, i, j;
    booleanArray = [];
    primes = [];
    data = e.data;
    upperLimit = data.upperLimit;
    powUpperLimit = Math.pow(upperLimit, 2);

    if (!upperLimit || upperLimit < 2) {
      return;
    }

    for (i = 2; i <= powUpperLimit; i = i + 1) {
      booleanArray.push(true);
    }

    for (i = 2; i <= booleanArray.length; i = i + 1) {
      if (!booleanArray[i]) {
        continue;
      }

      primes.push(i);
      j = i * i;

      while (j <= booleanArray.length) {
        booleanArray[j] = false;
        j = j + i;
      }

      if (primes.length === upperLimit) {
        break;
      }
    }

    self.postMessage({primes: primes});
  };
}
