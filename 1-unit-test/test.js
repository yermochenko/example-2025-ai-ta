const digit = require('./digit.js');

const assert = require('assert');
const { test, suite } = require('mocha');

suite('digit', function() {
    test('test 1', function() {
        assert.equal(digit(12345), 5);
    });

    test('test 2', function() {
        assert.equal(digit(-987654), 6);
    });

    test('test 3', function() {
        assert.equal(digit(1), 1);
    });

    test('test 4', function() {
        assert.equal(digit(0), 1);
    });
});
