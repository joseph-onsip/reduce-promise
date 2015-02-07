'use strict';

require('native-promise-only');
var map = require('./map');

module.exports = promiseArguments;

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
