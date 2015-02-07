'use strict';

require('native-promise-only');

module.exports = promisize(Array.prototype.reduce);
module.exports.reduce = module.exports;
module.exports.reduceRight = promisize(Array.prototype.reduceRight);
module.exports.promisize = promisize;

function promisize (reduceMethod) {
  return function (callback, initialValue) {
    var args = [promiseArguments(callback)];
    if (arguments.length > 1) {
      args.push(initialValue);
    }

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
    var args = Array.prototype.map.call(arguments, promiseArguments);
    return Promise.all(args).then(f.apply.bind(f, null));
  };
}
