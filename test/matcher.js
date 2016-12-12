'use strict';

var expect = require('must');
var matchers = require('../lib/matcher');

function shouldMatch(matcher, values) {
  var errors = [];
  values.forEach(function(value) {
    try {
      expect(matcher.matches(value)).to.be.true();
    } catch (error) {
      if (error.name === 'AssertionError') {
        var message = 'should match ' + value + ' but didn\'t.';
        errors.push(message);
      } else {
        throw error;
      }
    }
  });
  handleOptionalErrors(errors);
}

function shouldNotMatch(matcher, values) {
  var errors = [];
  values.forEach(function(value) {
    try {
      expect(matcher.matches(value)).to.be.false();
    } catch (error) {
      if (error.name === 'AssertionError') {
        var message = 'shouldn\'t match ' + value + ' but did.';
        errors.push(message);
      } else {
        throw error;
      }
    }
  });
  handleOptionalErrors(errors);
}

function handleOptionalErrors(errors) {
  if (errors.length > 0) {
    throw new Error(errors.join(',\n'));
  }
}

describe('Library "matcher"', function () {
  it('anyValue matches any value', function () {
    shouldMatch(matchers.anyValue, [
      undefined,
      null,
      'a string',
      1,
      new Date(),
      [],
      [1, 2, 3],
      {},
      {foo: 'bar', bar: 'foo'}
    ]);
    expect(matchers.anyValue.matches()).to.be.true();
  });

  it('notNull matches any value but null and undefined', function () {
   shouldMatch(matchers.notNull, [
      'a string',
      1,
      new Date(),
      [],
      [1, 2, 3],
      {},
      {foo: 'bar', bar: 'foo'}
    ]);
    shouldNotMatch(matchers.notNull, [
      undefined,
      null
    ]);
    expect(matchers.notNull.matches()).to.be.false();
  });
  it('anyNumber matches any Number', function () {
    shouldMatch(matchers.anyNumber, [
      0,
      -1,
      1,
      Number.EPSILON,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_VALUE,
      Number.MIN_SAFE_INTEGER,
      Number.MIN_VALUE,
      Number.NEGATIVE_INFINITY,
      Number.POSITIVE_INFINITY
    ]);

    shouldNotMatch(matchers.anyNumber, [
      undefined,
      null,
      'a string',
      [],
      [1, 2, 3],
      {},
      {foo: 'bar'},
      Number.NaN
    ]);
  });
});
