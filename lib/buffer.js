'use strict';

var util = require('util');

var Type = require('./Type');

function BufferType(rules) {
  BufferType.super_.call(this, BufferType.NAME, rules);
}

util.inherits(BufferType, Type);

BufferType.NAME = 'Buffer';

BufferType.prototype._validate = function (value) {
  var rules = this._rules;

  if (value instanceof Buffer === false) {
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
  return new BufferType(rules);
};
