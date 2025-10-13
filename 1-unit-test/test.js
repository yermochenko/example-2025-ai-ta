const digit = require('./digit.js');
const solve = require('./solve.js');

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

suite('solve', function() {
    test('test 1', function() {
        assert.deepEqual(solve(1, -3, 2), [1, 2]);
    });

    test('test 2', function() {
        assert.deepEqual(solve(1, -6, 9), [3]);
    });

    test('test 3', function() {
        assert.deepEqual(solve(1, -6, 11), []);
    });

    test('test 4', function() {
        assert.deepEqual(solve(0, 2, -3), [1.5]);
    });

    test('test 5', function() {
        assert.deepEqual(solve(0, 0, 1), []);
    });

    test('test 6', function() {
        assert.throws(() => { solve(0, 0, 0); }, { name: 'IllegalArguments' });
    });
});
