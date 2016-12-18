'use strict';

var getArgumentsAsArray = require('./arguments_helper').getArgumentsAsArray;

var core = require('./core');

var createMatcher = core.createMatcher;
var addMatcher = core.addMatcher;
var defineMatcherFunction = core.defineMatcherFunction;
var defineMatcherProperty = core.defineMatcherProperty;

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
  return typeof value === 'number' && !Number.isNaN(value);
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

function containingArrayElements () {
  var args = getArgumentsAsArray(arguments);
  var elements = args.slice(0, args.length - 1);
  var value = args[args.length - 1];
  return elements.every(function (expectedElement) {
    return value.some(function (arrayElement) {
      return expectedElement === arrayElement;
    });
  });
}

function createArrayMatcher() {
  var matcher = createMatcher(isArray);
  defineMatcherFunction(matcher, 'withMoreThan', lengthGreaterThan);
  defineMatcherFunction(matcher, 'withLessThan', lengthLessThan);
  defineMatcherFunction(matcher, 'withExact', lengthEqual);
  defineMatcherFunction(matcher, 'containing', containingArrayElements);
  defineMatcherProperty(matcher, 'empty', empty);
  defineMatcherProperty(matcher, 'notEmpty', notEmpty);
  matcher.elements = matcher;
  matcher.and = matcher;
  return matcher;
}

function createStringMatcher() {
  var matcher = createMatcher(isString);
  defineMatcherProperty(matcher, 'empty', empty);
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
