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
var anyNumber = new Matcher(function (number) {
  return typeof number === 'number' && !Number.isNaN(number);
});

module.exports = {
  anyValue: anyValue,
  notNull: notNull,
  anyNumber: anyNumber
};
