/*global describe, it*/
'use strict';
var mocha = require('mocha'),
  assert = require('chai').assert,
  Literal = require('../l33teral'),
  GraphError = require('../graph-error'),
  mockObject = require('./mock-object');

describe('L33teral', function () {

  describe('#obj', function () {
    it('should be equal to the constructor argument', function (done) {
      var expected = mockObject();
      var lit = new Literal(expected);
      assert.equal(lit.obj, expected);
      done();
    });
  });

  describe('#tap()', function () {
    it('should throw if the graph is not present and no default value is provided', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      assert.throw(function () {
        lit.tap('address.missing');
      }, GraphError);

      done();
    });

    it('should return the default value if no graph is present and the default value is provided', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var expected = '646';
      var actual = lit.tap('phoneNumber.1.areaCode', expected);
      assert.equal(actual, expected);

      done();
    });

    it('should return the value at the path if the graph is present', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var expected = 'New York';
      var actual = lit.tap('address.city');
      assert.equal(actual, expected);

      expected = 'fax';
      actual = lit.tap('phoneNumber.1.type');
      assert.equal(actual, expected);

      done();
    });
  });

  describe('#probe()', function () {
    it('should return true if the object graph is present', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.probe('address.city');
      assert.isTrue(actual);

      actual = lit.probe('phoneNumber.1');
      assert.isTrue(actual);

      actual = lit.probe('phoneNumber.1.number');
      assert.isTrue(actual);

      done();
    });

    it('should return false if the object graph is absent', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.probe('address.missing');
      assert.isFalse(actual);

      actual = lit.probe('phoneNumber.1.missing');
      assert.isFalse(actual);

      actual = lit.probe('phoneNumber.2');
      assert.isFalse(actual);

      done();
    });
  });

  describe('#collect()', function () {
    it('should return all values for all graphs', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.collect('firstName', 'address.state', 'phoneNumber.1.type');
      assert.lengthOf(actual, 3);
      assert.equal(actual[0], 'John');
      assert.equal(actual[1], 'NY');
      assert.equal(actual[2], 'fax');

      var args = ['firstName', 'address.state', 'phoneNumber.1.type'];
      actual = lit.collect(args);
      assert.lengthOf(actual, 3);
      assert.equal(actual[0], 'John');
      assert.equal(actual[1], 'NY');
      assert.equal(actual[2], 'fax');

      done();
    });

    it('should return undefined when graphs cannot be found', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.collect('firstName', 'address.missing', 'phoneNumber.1.missing');
      assert.lengthOf(actual, 3);
      assert.equal(actual[0], 'John');
      assert.equal(actual[1], undefined);
      assert.equal(actual[2], undefined);

      done();
    });

    it('should return default values when graphs cannot be found and default values are provided', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var args = {
        'firstName': 'Steve',
        'address.county': 'North County',
        'phoneNumber.1.areaCode': '555'
      };

      var actual = lit.collect(args);
      assert.lengthOf(actual, 3);
      assert.equal(actual[0], 'John');
      assert.equal(actual[1], args['address.county']);
      assert.equal(actual[2], args['phoneNumber.1.areaCode']);

      done();
    });
  });

  describe('#hasAllProperties()', function () {
    it('should return true when all properties are present', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.hasAllProperties('firstName', 'lastName', 'phoneNumber');
      assert.isTrue(actual);

      var args = ['firstName', 'lastName', 'phoneNumber'];
      actual = lit.hasAllProperties(args);
      assert.isTrue(actual);

      done();
    });

    it('should return false if any properties are missing', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.hasAllProperties('firstName', 'lastName', 'missing');
      assert.isFalse(actual);

      var args = ['firstName', 'lastName', 'missing'];
      actual = lit.hasAllProperties(args);
      assert.isFalse(actual);

      done();
    });
  });

  describe('#hasAnyProperties()', function () {
    it('should return true if any properties are present', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.hasAnyProperties('firstName', 'missing1', 'missing2');
      assert.isTrue(actual);

      var args = ['firstName', 'missing1', 'missing2'];
      actual = lit.hasAnyProperties(args);
      assert.isTrue(actual);

      done();
    });

    it('should return false if no properties are present', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.hasAnyProperties('missing1', 'missing2', 'missing3');
      assert.isFalse(actual);

      var args = ['missing1', 'missing2', 'missing3'];
      actual = lit.hasAnyProperties(args);
      assert.isFalse(actual);

      done();
    });
  });

  describe('#hasAllGraphs()', function () {
    it('should return true if all graphs are present', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.hasAllGraphs('address.city', 'address.state', 'phoneNumber.0');
      assert.isTrue(actual);

      var args = ['address.city', 'address.state', 'phoneNumber.0'];
      actual = lit.hasAllGraphs(args);
      assert.isTrue(actual);

      done();
    });

    it('should return false if any graphs are missing', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.hasAllGraphs('address.city', 'address.state', 'phoneNumber.0.missing');
      assert.isFalse(actual);

      var args = ['address.city', 'address.state', 'phoneNumber.0.missing'];
      actual = lit.hasAllGraphs(args);
      assert.isFalse(actual);

      done();
    });
  });

  describe('#hasAnyGraphs()', function () {
    it('should return true if any graphs are present', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.hasAnyGraphs('address.missing', 'address.state', 'phoneNumber.2');
      assert.isTrue(actual);

      var args = ['address.missing', 'address.state', 'phoneNumber.2'];
      actual = lit.hasAnyGraphs(args);
      assert.isTrue(actual);

      done();
    });

    it('should return false if no graphs are present', function (done) {
      var mock = mockObject();
      var lit = new Literal(mock);

      var actual = lit.hasAnyGraphs('address.missing', 'missing', 'phoneNumber.2');
      assert.isFalse(actual);

      var args = ['address.missing', 'missing', 'phoneNumber.2'];
      actual = lit.hasAnyGraphs(args);
      assert.isFalse(actual);

      done();
    });
  });
});