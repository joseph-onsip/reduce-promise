'use strict';

var curryContext = require('./curry-context');
var promiseArguments = require('./promise-arguments');

module.exports = promisize(Array.prototype.reduce);
module.exports.reduce = module.exports;
module.exports.reduceRight = promisize(Array.prototype.reduceRight);
module.exports.promisize = promisize;

function promisize (method) {
  return promiseArguments(curryContext(method), true);
}
