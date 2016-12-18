'use strict';
var matchers = {};

function Matcher(typeFunc) {
  this.matcherFuncs = [typeFunc];
  this.negateNextFunc = false;
  this.addMatcherFunc = function (additionalFunc) {
    if (this.negateNextFunc) {
      additionalFunc = negate(additionalFunc);
      this.negateNextFunc = false;
    }
    this.matcherFuncs.push(additionalFunc);
  };
  this.matches = function () {
    var args = arguments;
    return this.matcherFuncs.every(function(func) {
      return func.apply(null, args);});
  };
}

function negate(func) {
  return function () {
    return !func.apply(null, arguments);
  };
}

function createMatcher(func) {
  var matcher = new Matcher(func);
  Object.defineProperty(matcher, 'not', {
    get: function () {this.negateNextFunc = true; return this;}
  });
  return matcher;
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

