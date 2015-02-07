'use strict';

require('native-promise-only');

var map = Array.prototype.map.call.bind(Array.prototype.map);

module.exports = promisize(Array.prototype.reduce);
module.exports.reduce = module.exports;
module.exports.reduceRight = promisize(Array.prototype.reduceRight);
module.exports.promisize = promisize;

function promisize (reduceMethod) {
  function partialReduce (/* callback, initialValue */) {
    var args = arguments;
    return function (object) {
      return reduceMethod.apply(object, args);
    }
  };
  return promiseArguments(partialReduce, true);
}

function promiseArguments (f, partial) {
  if (typeof f !== 'function') {
    return f;
  }
  return function () {
    var args = map(arguments, promiseArguments);
    var applyF = f.apply.bind(f, null);
    if (partial) {
      return promiseArguments(applyF(args))
    }
    return Promise.all(args).then(applyF);
  };
}
