'use strict';

require('native-promise-only');

var map = Array.prototype.map.call.bind(Array.prototype.map);

module.exports = promisize(Array.prototype.reduce);
module.exports.reduce = module.exports;
module.exports.reduceRight = promisize(Array.prototype.reduceRight);
module.exports.promisize = promisize;

function promisize (reduceMethod) {
  return function partialReduce (/* callback, initialValue */) {
    var args = map(arguments, promiseArguments);
    return promiseArguments(function (object) {
      return reduceMethod.apply(object, args);
    });
  }
}

function promiseArguments (f) {
  if (typeof f !== 'function') {
    return f;
  }
  return function () {
    var args = map(arguments, promiseArguments);
    return Promise.all(args).then(f.apply.bind(f, null));
  };
}
