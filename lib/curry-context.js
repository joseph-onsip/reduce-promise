'use strict';

module.exports = curryContext;

function curryContext (method) {
  return function () {
    var args = arguments;
    return function (object) {
      return method.apply(object, args);
    }
  }
}
