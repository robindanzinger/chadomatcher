'use strict';

var expect = require('must');
var matcher = require('../lib/matcher');

describe('Library "matcher"', function () {
  it('matches identical objects', function () {
    expect(matcher.match()).to.be.true();
  });
});
