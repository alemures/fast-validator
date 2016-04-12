'use strict';

var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

function NumberType() {
  NumberType.super_.call(this);
}

util.inherits(NumberType, Type);

NumberType.prototype.min = function (limit) {
  this._rules.min = limit;
  return this;
};

NumberType.prototype.max = function (limit) {
  this._rules.max = limit;
  return this;
};

NumberType.prototype.integer = function () {
  this._rules.integer = true;
  return this;
};

NumberType.prototype.positive = function () {
  this._rules.positive = true;
  return this;
};

NumberType.prototype.negative = function () {
  this._rules.negative = true;
  return this;
};

NumberType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'number') {
    return !rules.required && value === undefined;
  }

  var min = rules.min;
  var max = rules.max;
  var integer = rules.integer;
  var positive = rules.positive;
  var negative = rules.negative;

  if (min !== undefined && value < min ||
      max !== undefined && value > max) {
    return false;
  }

  if (integer && !ut.isInteger(value)) {
    return false;
  }

  if (positive && value <= 0) {
    return false;
  }

  if (negative && value >= 0) {
    return false;
  }

  return rules.forbidden ? false : true;
};

module.exports = function () {
  return new NumberType();
};
