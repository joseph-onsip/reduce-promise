'use strict';

var test = require('tape');
var reducePromise = require('../');

var identityPromise = Promise.resolve.bind(Promise);

function mapPromise (mapper) {
  return reducePromise(function (acc, value, index, array) {
    return Promise.all(acc.concat(mapper(value, index, array)));
  }, []);
}

function filterPromise (filterer) {
  return reducePromise(function (acc, value, index, array) {
    return Promise.resolve(filterer(value, index, array)).then(function (keep) {
      if (keep) {
        return acc.concat(value);
      }
      return acc;
    })
  }, []);
}

test(function (t) {
  t.plan(2);

  mapPromise(identityPromise)([1,0,1]).then(function (result) {
    t.deepEqual(result, [1,0,1]);
  });

  filterPromise(identityPromise)([1,0,1]).then(function (result) {
    t.deepEqual(result, [1,1]);
  });
});
