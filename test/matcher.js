'use strict';

var expect = require('must');
var matchers = require('../lib/matcher');

function shouldMatch(matcher, values) {
  handleBlockAssertion('true', matcher, values, 'should match %1 but didn\'t.');
}

function shouldNotMatch(matcher, values) {
  handleBlockAssertion('false', matcher, values, 'shouldn\'t match %1 but did.');
}

function handleBlockAssertion(assertionFunc, matcher, values, message) {
  var errors = [];
  values.forEach(function(value) {
    try {
      expect(matcher.matches(value)).to.be[assertionFunc]();
    } catch (error) {
      if (error.name === 'AssertionError') {
        errors.push(message.replace('%1', value));
      } else {
        throw error;
      }
    }
  });
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
      1.99999,
      -0.458,
      13 / 48,
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
  it('anyDate matches any Date', function () {
    shouldNotMatch(matchers.anyDate, [
      undefined,
      null,
      'a string',
      {},
      1,
      [1, 2, 3],
      Date.now()
    ]);
    shouldMatch(matchers.anyDate, [
      new Date(),
      new Date(1999, 12, 31),
      new Date(0)
    ]);
  });
  it('anyString matches any String', function () {
    shouldNotMatch(matchers.anyString, [
      undefined,
      null,
      {foo: 'bar'},
      1,
      [1, 2, 3],
      Date.now(),
      /aregexstring/gi
    ]);
    shouldMatch(matchers.anyString, [
      '',
      'a string',
      new Date().toString(),
      /*eslint-disable */
      new String(),
      new String('foo')
      /*eslint-enable */
    ]);
  });
  it('anyRegex matches any Regex', function () {
    shouldNotMatch(matchers.anyRegex, [
      undefined,
      null,
      {foo: 'bar'},
      1,
      [1, 2, 3],
      Date.now(),
      'a string'
    ]);
    shouldMatch(matchers.anyRegex, [
      /aregex/gi,
      /aregex/,
      / /,
      /\*/,
      new RegExp('', ''),
      new RegExp(),
      new RegExp('aregex'),
      new RegExp('aregex', 'gim')
    ]);
  });
  it('anyArray matches any array', function () {
    shouldNotMatch(matchers.anyArray, [
      undefined,
      null,
      {foo: 'bar'},
      1,
      Date.now(),
      'a string'
    ]);
    shouldMatch(matchers.anyArray, [
      [],
      [1, 2, 3],
      /*eslint-disable */
      new Array(),
      new Array('foo', 2, 'bar')
      /*eslint-enable */
    ]);
  });
  it('anyObject matches any object', function () {
     shouldNotMatch(matchers.anyObject, [
      undefined,
      null,
      1,
      Date.now(),
      'a string'
    ]);
    shouldMatch(matchers.anyObject, [
      {},
      [],
      [1, 2, 3],
      new Date(),
      /*eslint-disable */
      new Object(),
      new String(),
      /*eslint-enable */
      {foo: 'bar'},
      /aregex/gi
    ]);
  });
  it('empty.array matches any empty array', function () {
    shouldNotMatch(matchers.empty.array, [
      undefined,
      null,
      {foo: 'bar'},
      1,
      Date.now(),
      'a string',
      [1],
      [1, 2, 3]
    ]);
    shouldMatch(matchers.empty.array, [
      [],
      /*eslint-disable */
      new Array()
      /*eslint-enable */
    ]);
  });
  it('not.empty.array matches any non empty array', function () {
    shouldNotMatch(matchers.not.empty.array, [
      undefined,
      null,
      /*eslint-disable */
      new Array(),
      /*eslint-enable */
      [],
    ]);
    shouldMatch(matchers.not.empty.array, [
      ['foo'],
      /*eslint-disable */
      new Array(1, 2, 3)
      /*eslint-enable */
    ]);
  });
  it('array.ofLength(n) matches any array with n elements', function () {
    shouldNotMatch(matchers.array.ofLength(3), [
      undefined,
      null,
      [1, 2],
      [1, 2, 3, 4]
    ]);
    shouldMatch(matchers.array.ofLength(3), [
      [1, 2, 3]
    ]);
    expect(matchers.array.ofLength(1).matches([1])).to.be.true();
    expect(matchers.array.ofLength(1).matches([1, 2])).to.be.false();
  });
  it('array.withMoreThan(n).elements matches any array with more than n elements', function () {
    shouldNotMatch(matchers.array.withMoreThan(3).elements, [
      undefined,
      null,
      [1, 2],
      [1, 2, 3]
    ]);
    shouldMatch(matchers.array.withMoreThan(3).elements, [
      [1, 2, 3, 4],
      [1, 2, 3, 4, 5]
    ]);
    expect(matchers.array.withMoreThan(0).elements.matches([1])).to.be.true();
    expect(matchers.array.withMoreThan(2).elements.matches([1, 2])).to.be.false();
  });
  it('array.withLessThan(n).elements matches any array with less than n elements', function () {
    shouldNotMatch(matchers.array.withLessThan(3).elements, [
      undefined,
      null,
      [1, 2, 3, 4],
      [1, 2, 3]
    ]);
    shouldMatch(matchers.array.withLessThan(3).elements, [
      [1, 2],
      [1],
      []
    ]);
    expect(matchers.array.withLessThan(2).elements.matches([1])).to.be.true();
    expect(matchers.array.withLessThan(2).elements.matches([1, 2])).to.be.false();
  });
//  it('array.withMoreThan(n).elements.and.withLessThan(m).elements matches any array with less than n elements', function () {
//    shouldNotMatch(matchers.array.withMoreThan(2).elements.and.withLessThan(4).elements, [
//      undefined,
//      null,
//      [1, 2, 3, 4],
//      [1, 2]
//    ]);
//    shouldMatch(matchers.array.withMoreThan(2).elements.and.withLessThan(4).elements, [
//      [1, 2, 3],
//    ]);
//    shouldMatch(matchers.array.withLessThan(3).elements.and.withMoreThan(1).elements, [
//      [1, 2],
//    ]);
//
//    function foo () {
//      return {bar: bar()};
//    }
//    function bar() {
//      return {foo: foo()};
//    }
//    foo.bar;
//  });
  it('empty.string matches an empty string', function () {
    shouldNotMatch(matchers.empty.string, [
      undefined,
      null,
      'a non empty string',
    ]);
    shouldMatch(matchers.empty.string, [
      '',
      /*eslint-disable */
      new String(),
      new String('')
      /*eslint-enable */
    ]);
  });
});
