'use strict';

/*
adapted from Underscore
https://github.com/jashkenas/underscore/blob/58113cf08ce27fe4cc94a969c18c75f3d340db54/test/collections.js#L146-L190
*/

var test = require('tape');
var reducePromise = require('../');
var nop = require('nop');

var add = function(sum, num){ return sum + num; };
var multiply = function(prod, num){ return prod * num; };

testMethod('reduce', 'can sum up an array', [1, 2, 3], [add, 0], 6);
testMethod('reduce', 'default initial value', [1, 2, 3], [add], 6);
testMethod('reduce', 'can reduce via multiplication', [1, 2, 3, 4], [multiply], 24);
testMethod('reduce', 'undefined can be passed as a special case', [], [nop, undefined], undefined);
testMethod('reduce', 'collection of length one with no initial value returns the first item', [1], [nop], 1);

var concat = function(memo, str){ return memo + str; };

testMethod('reduceRight', 'can perform right folds', ['foo', 'bar', 'baz'], [concat, ''], 'bazbarfoo');
testMethod('reduce', 'can perform left folds', ['foo', 'bar', 'baz'], [concat, ''], 'foobarbaz');
testMethod('reduceRight', 'default initial value', ['foo', 'bar', 'baz'], [concat], 'bazbarfoo');
testMethod('reduceRight', 'collection of length one with no initial value returns the first item', [1], [nop], 1);
testMethod('reduceRight', 'undefined can be passed as a special case', [], [nop, undefined], undefined);

test(function (t) {
  t.plan(1);
  t.equal(reducePromise, reducePromise.reduce, 'default export is reduce');
});

function testMethod (methodName, name, array, args, expected) {
  var callback = args[0];
  var callbackAsync = function () {
    var innerArgs = arguments;
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(callback.apply(null, innerArgs))
      });
    });
  };

  testArgs(name, methodName, args, array, expected, 'callback');
  args[0] = callbackAsync;
  testArgs(name, methodName, args, array, expected, 'callbackAsync');
}

function testArgs (name, methodName, args, array, expected, callbackType) {
  test(function (t) {
    t.plan(3);

    testArray(array, 'array')
    testArray(Promise.resolve(array), 'arrayPromise');
    testArray(array.map(Promise.resolve.bind(Promise)), 'promiseArray');

    function testArray (arrayObj, arrayType) {
      var message = methodName + ': ' + name + ' (' + arrayType + ', ' + callbackType+ ')';
      return reducePromise[methodName].apply(null, args)(arrayObj).then(function (result) {
        t.equal(result, expected, message);
      });
    }
  });
}
