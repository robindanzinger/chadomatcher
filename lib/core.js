'use strict';
var matchers = {};

function Matcher(typeFilter) {
  this.filters = [typeFilter];
  this.negateNextFilter = false;
  this.addFilter = function (filter) {
    if (this.negateNextFilter) {
      filter = negate(filter);
      this.negateNextFilter = false;
    }
    this.filters.push(filter);
  };
  this.matches = function () {
    var args = arguments;
    return this.filters.every(function(func) {
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
    get: function () {this.negateNextFilter = true; return this;}
  });
  return matcher;
}

function addMatcher(name, constructor) {
  Object.defineProperty(matchers, name, {get: constructor});
}

function createFilter(matcher, filter) {
  return function(...args) {
    this.addFilter(filter.bind(matcher, ...args));
    return matcher;
  };
}

function defineFilterFunction (matcher, name, func) {
  Object.defineProperty(matcher, name, {
    get: function () {return createFilter(matcher, func);}
  });
}

function defineFilterProperty(matcher, name, func) {
  Object.defineProperty(matcher, name, {
    get: function () {this.addFilter(func); return this;}
  });
}

module.exports = {
  createMatcher: createMatcher,
  addMatcher: addMatcher,
  defineFilterFunction: defineFilterFunction,
  defineFilterProperty: defineFilterProperty,
  matchers: matchers
};

