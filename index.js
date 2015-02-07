'use strict';

require('native-promise-only');

module.exports = promisifyReduceMethod.bind(null, 'reduce');
module.exports.reduce = module.exports;
module.exports.reduceRight = promisifyReduceMethod.bind(null, 'reduceRight');

function promisifyReduceMethod (methodName, callback, initialValue) {
  var args = [promisifyReducer(callback)];
  if (arguments.length > 2) {
    args.push(initialValue);
  }

  return function (arrayPromise) {
    return Promise.resolve(arrayPromise).then(function (array) {
      return array[methodName].apply(array, args);
    });
  };
}

function promisifyReducer (callback) {
  return function promisifiedReducer (previousValue, currentValue, index, array) {
    return Promise.all([previousValue, currentValue]).then(function (values) {
      var previousValue = values[0];
      var currentValue = values[1];
      return callback(previousValue, currentValue, index, array);
    });
  }
}
