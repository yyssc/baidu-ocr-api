/*jslint node: true */

'use strict;'

const assert = require('assert');
const should = require('should');
const char2int = require('../lib/utils').char2int;

suite('utils', function() {
  setup(function() {
    // ...
  });

  suite('#char2num()', function() {
    test('should return correct number for given string', function() {
      assert.equal(1, char2int('1'));
      assert.equal(2, char2int('2'));
      assert.equal(1234, char2int('1234'));

      assert.equal(2, char2int('z'));
      assert.equal(1234, char2int('1z34'));
    });
  });
});

