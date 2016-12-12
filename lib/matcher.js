'use strict';

var getArgumentsAsArray = require('./arguments_helper').getArgumentsAsArray;

function Matcher(matcherFunc) {
  this.matches = matcherFunc;
}

function isNotNull(value) {
  return value !== null;
}

var anyValue = new Matcher(function () { return true;});

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

var empty = {
  array: new Matcher(function (value) {
    return anyArray.matches(value) && value.length === 0;
  })
};

module.exports = {
  anyValue: anyValue,
  notNull: notNull,
  anyNumber: anyNumber,
  anyDate: anyDate,
  anyString: anyString,
  anyRegex: anyRegex,
  anyArray: anyArray,
  anyObject: anyObject,
  empty: empty
};
