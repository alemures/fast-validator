'use strict';

var util = require('util');

var Type = require('./Type');

function ArrayType(rules) {
  ArrayType.super_.call(this, ArrayType.NAME, rules);
}

util.inherits(ArrayType, Type);

ArrayType.NAME = 'Array';

ArrayType.prototype._validate = function (value) {
  var rules = this._rules;

  if (!Array.isArray(value)) {
    return this._isAllowed(value);
  }

  var min = rules.min;
  var max = rules.max;
  var length = rules.length;

  var valueLength = value.length;

  if (min !== undefined && valueLength < min ||
      max !== undefined && valueLength > max) {
    return false;
  }

  if (length !== undefined && valueLength !== length) {
    return false;
  }

  return true;
};

module.exports = function (rules) {
  return new ArrayType(rules);
};
