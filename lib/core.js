'use strict';
var matchers = {};

function Matcher(typeFunc) {
  this.matcherFuncs = [typeFunc];
  this.addMatcherFunc = function (additionalFunc) {
    this.matcherFuncs.push(additionalFunc);
  };
  this.matches = function () {
    var args = arguments;
    return this.matcherFuncs.every(function(func) {
      return func.apply(null, args);});
  };
}

function createMatcher(func) {
  return new Matcher(func);
}

function addMatcher(name, constructor) {
  Object.defineProperty(matchers, name, {get: constructor});
}

function createMatcherFunction(matcher, matcherFunc) {
  return function(...args) {
    this.addMatcherFunc(matcherFunc.bind(matcher, ...args));
    return matcher;
  };
}

function defineMatcherFunction (matcher, name, func) {
  Object.defineProperty(matcher, name, {
    get: function () {return createMatcherFunction(matcher, func);}
  });
}

function defineMatcherProperty(matcher, name, func) {
  Object.defineProperty(matcher, name, {
    get: function () {this.addMatcherFunc(func); return this;}
  });
}

module.exports = {
  createMatcher: createMatcher,
  addMatcher: addMatcher,
  defineMatcherFunction: defineMatcherFunction,
  defineMatcherProperty: defineMatcherProperty,
  matchers: matchers
};

