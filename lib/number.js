'use strict';

var assert = require('assert');
var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

/**
 * Generates a schema object that matches a number data type.
 *
 * @constructor
 * @extends Type
 */
function NumberType() {
  NumberType.super_.call(this);
}

util.inherits(NumberType, Type);

/**
 * Specifies the minimum value.
 * @param  {Number} limit The minimum value allowed.
 * @return {NumberType} The class reference so multiple calls can be chained.
 */
NumberType.prototype.min = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

  this._rules.min = limit;
  return this;
};

/**
 * Specifies the maximum value.
 * @param  {Number} limit The maximum value allowed.
 * @return {NumberType} The class reference so multiple calls can be chained.
 */
NumberType.prototype.max = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

  this._rules.max = limit;
  return this;
};

/**
 * Requires the number to be an integer (no floating point).
 * @return {NumberType} The class reference so multiple calls can be chained.
 */
NumberType.prototype.integer = function () {
  this._rules.integer = true;
  return this;
};

/**
 * Requires the number to be positive.
 * @return {NumberType} The class reference so multiple calls can be chained.
 */
NumberType.prototype.positive = function () {
  this._rules.positive = true;
  return this;
};

/**
 * Requires the number to be negative.
 * @return {NumberType} The class reference so multiple calls can be chained.
 */
NumberType.prototype.negative = function () {
  this._rules.negative = true;
  return this;
};

NumberType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'number' || ut.isNaNOrInfinity(value)) {
    return !rules.required && value === undefined;
  }

  var min = rules.min;
  var max = rules.max;

  if (min !== undefined && value < min ||
      max !== undefined && value > max) {
    return false;
  }

  if (rules.integer && !ut.isInteger(value)) {
    return false;
  }

  if (rules.positive && value <= 0) {
    return false;
  }

  if (rules.negative && value >= 0) {
    return false;
  }

  return rules.forbidden ? false : true;
};

/**
 * Creates and returns a NumberType object.
 * @return {NumberType} The NumberType object.
 * @global
 * @alias number
 */
module.exports = function number() {
  return new NumberType();
};
