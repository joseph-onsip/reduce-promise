'use strict';

require('native-promise-only');

module.exports = promisifyReduceMethod.bind(null, 'reduce');
module.exports.reduce = module.exports;
module.exports.reduceRight = promisifyReduceMethod.bind(null, 'reduceRight');

function promisifyReduceMethod (methodName, callback, initialValue) {
  var args = [promiseArguments(callback)];
  if (arguments.length > 2) {
    args.push(initialValue);
  }

  return promiseArguments(function (array) {
    return array[methodName].apply(array, args);
  });
}

function promiseArguments (f) {
  if (typeof f !== 'function') {
    return f;
  }
  return function () {
    var args = Array.prototype.map.call(arguments, promiseArguments);
    return Promise.all(args).then(f.apply.bind(f, null));
  };
}
