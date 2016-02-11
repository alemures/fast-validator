'use strict';

var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

function NumberType(rules) {
  NumberType.super_.call(this, NumberType.NAME, rules);
}

util.inherits(NumberType, Type);

NumberType.NAME = 'Number';

NumberType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'number') {
    return this._isAllowed(value);
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

  return true;
};

module.exports = function (rules) {
  return new NumberType(rules);
};
