'use strict';

var expect = require('must');
var matcher = require('../lib/matcher');

describe('Library "matcher"', function () {
  it('anyValue matches any value', function () {
    expect(matcher.anyValue.matches()).to.be.true();
    expect(matcher.anyValue.matches(undefined)).to.be.true();
    expect(matcher.anyValue.matches(null)).to.be.true();
    expect(matcher.anyValue.matches('a string')).to.be.true();
    expect(matcher.anyValue.matches(1)).to.be.true();
    expect(matcher.anyValue.matches(new Date())).to.be.true();
    expect(matcher.anyValue.matches([1, 2, 3])).to.be.true();
    expect(matcher.anyValue.matches({foo: 'bar', bar: 'foo'})).to.be.true();
  });
  it('notNull matches any value but null and undefined', function () {
    expect(matcher.notNull.matches()).to.be.false();
    expect(matcher.notNull.matches(undefined)).to.be.false();
    expect(matcher.notNull.matches(null)).to.be.false();
    expect(matcher.notNull.matches('a string')).to.be.true();
    expect(matcher.notNull.matches(1)).to.be.true();
    expect(matcher.notNull.matches(new Date())).to.be.true();
    expect(matcher.notNull.matches([1, 2, 3])).to.be.true();
    expect(matcher.notNull.matches({foo: 'bar', bar: 'foo'})).to.be.true();
  });
});
