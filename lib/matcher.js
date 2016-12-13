'use strict';

var getArgumentsAsArray = require('./arguments_helper').getArgumentsAsArray;

function Matcher(matcherFunc) {
  this.matches = matcherFunc;
}

var anyValue = new Matcher(function () { return true;});

function isNotNull(value) {
  return value !== null;
}

var notNull = new Matcher(function () {
  var args = getArgumentsAsArray(arguments);
  return args.length > 0 && args.some(isNotNull);
});

var anyNumber = new Matcher(function (value) {
  return typeof value === 'number' && !Number.isNaN(value);
});

var anyDate = new Matcher(function (value) {
  return value instanceof Date;
});

var anyString = new Matcher(function (value) {
  return typeof value === 'string' || value instanceof String;
});

var anyRegex = new Matcher(function (value) {
  return value instanceof RegExp;
});

var anyArray = new Matcher(function (value) {
  return value instanceof Array;
});

var anyObject = new Matcher(function (value) {
  return typeof value === 'object' && isNotNull(value);
});

function concat(firstMatcher, secondMatcher) {
  return new Matcher(function () {
    return firstMatcher.matches.apply(null, arguments) && secondMatcher.matches.apply(null, arguments);
  });
}

var zeroLength = new Matcher(function (value) {
  return value.length === 0;
});

var empty = {
  array: concat(anyArray, zeroLength),
  string: concat(anyString, zeroLength)
};

function negate(matcher) {
  return new Matcher(function () {return !matcher.matches.apply(null, arguments)});
}

function negateAll(obj) {
  var result ={};
  Object.keys(obj).forEach(function (key) {
    result[key] = negate(obj[key]);
  });
  console.log(result);
  return result;
}

var not = {
  empty: {array: concat(anyArray, negate(zeroLength)),
          string: concat(anyString, negate(zeroLength))}
}

function ofLength(length) {
  return new Matcher(function(value) {return value.length === length;});   
}

anyArray.ofLength = function (length) {return concat(anyArray, ofLength(length));};

function greaterThan(size) {
  return new Matcher(function (value) {return value.length > size;});
}

anyArray.withMoreThan = function (length) {return {
  elements: concat(anyArray, greaterThan(length))
};};

function lessThan(size) {
  return new Matcher(function (value) {return value.length < size;});
}

anyArray.withLessThan = function (size) {return {
  elements : concat(anyArray, lessThan(size))
};};

module.exports = {
  anyValue: anyValue,
  notNull: notNull,
  anyNumber: anyNumber,
  anyDate: anyDate,
  anyString: anyString,
  anyRegex: anyRegex,
  anyArray: anyArray,
  array: anyArray,
  anyObject: anyObject,
  empty: empty,
  not: not,
};
