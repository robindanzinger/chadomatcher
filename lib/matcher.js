'use strict';

var getArgumentsAsArray = require('./arguments_helper').getArgumentsAsArray;

var core = require('./core');

var createMatcher = core.createMatcher;
var addMatcher = core.addMatcher;
var defineFilterFunction = core.defineFilterFunction;
var defineFilterProperty = core.defineFilterProperty;

function anyValue () {
  return true;
}

function isNotNull(value) {
  return value !== null;
}

function notNull () {
  var args = getArgumentsAsArray(arguments);
  return args.length > 0 && args.some(isNotNull);
}

function anyNumber (value) {
  return (typeof value === 'number' || value instanceof Number) && !Number.isNaN(value);
}

function anyDate (value) {
  return value instanceof Date;
}

function isString (value) {
  return typeof value === 'string' || value instanceof String;
}

function anyRegex (value) {
  return value instanceof RegExp;
}

function isArray (value) {
  return value instanceof Array;
}

function lengthEqual(size, value) {
  return value.length === size;
}

function lengthGreaterThan(size, value) {
  return value.length > size;
}

function lengthLessThan(size, value) {
  return value.length < size;
}

function empty(value) {
  return value.length === 0;
}

function notEmpty(value) {
  return value.length > 0;
}

function isObject (value) {
  return typeof value === 'object' && isNotNull(value);
}

function matches(expected, actual) {
  return expected === actual;
}

function containingArrayElements () {
  var args = getArgumentsAsArray(arguments);
  var elements = args.slice(0, args.length - 1);
  var array = args[args.length - 1];
  array = array.slice(0, array.length);
  return elements.every(function (expectedElement) {
    return array.some(function (arrayElement) {
      if (matches(expectedElement, arrayElement)) {
        array.splice(array.indexOf(arrayElement), 1);
      }
      return matches(expectedElement, arrayElement);
    });
  });
}

function containingAnyArrayElements () {
  var args = getArgumentsAsArray(arguments);
  var elements = args.slice(0, args.length - 1);
  var array = args[args.length - 1];
  return elements.some(function (expectedElement) {
    return array.some(function (arrayElement) {
      return matches(expectedElement, arrayElement);
    });
  });
}

function createArrayMatcher() {
  var matcher = createMatcher(isArray);
  defineFilterFunction(matcher, 'withMoreThan', lengthGreaterThan);
  defineFilterFunction(matcher, 'withLessThan', lengthLessThan);
  defineFilterFunction(matcher, 'withExact', lengthEqual);
  defineFilterFunction(matcher, 'containing', containingArrayElements);
  defineFilterFunction(matcher, 'containingAny', containingAnyArrayElements);
  defineFilterProperty(matcher, 'empty', empty);
  defineFilterProperty(matcher, 'notEmpty', notEmpty);
  matcher.elements = matcher;
  matcher.and = matcher;
  return matcher;
}

function createStringMatcher() {
  var matcher = createMatcher(isString);
  defineFilterProperty(matcher, 'empty', empty);
  return matcher;
}

addMatcher('anyArray', createArrayMatcher);
addMatcher('array', createArrayMatcher);
addMatcher('anyString', createStringMatcher);
addMatcher('string', createStringMatcher);

addMatcher('anyValue', createMatcher.bind(null, anyValue));
addMatcher('anyNumber', createMatcher.bind(null, anyNumber));
addMatcher('anyDate', createMatcher.bind(null, anyDate));
addMatcher('anyRegex', createMatcher.bind(null, anyRegex));
addMatcher('notNull', createMatcher.bind(null, notNull));
addMatcher('anyObject', createMatcher.bind(null, isObject));

module.exports = core.matchers;
