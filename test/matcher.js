'use strict';

var expect = require('must');
var matchers = require('../lib/matcher');

function shouldMatch(matcher, values) {
  values.forEach(function(value) {
    try {
      expect(matcher.matches(value)).to.be.true();
    } catch (error) {
      var message = 'should match ' + value + ' but didn\'t.';
      throw new Error(message);
    }
  });
}

function shouldNotMatch(matcher, values) {
  values.forEach(function(value) {
    try {
      expect(matcher.matches(value)).to.be.false();
    } catch (error) {
      var message = 'shouldn\'t match ' + value + ' but did.';
      throw new Error(message);
    }
  });
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
      {foo: 'bar', bar: 'foo'}
    ]);
    shouldNotMatch(matchers.notNull, [
      undefined,
      null
    ]);
    expect(matchers.notNull.matches()).to.be.false();
  });
  it.skip('anyNumber matches any Number', function () {
  });
});
