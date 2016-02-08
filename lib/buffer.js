'use strict';

var util = require('util');

var Type = require('./Type');
var utils = require('./utils');

function BufferType(rules) {
  BufferType.super_.call(this, rules);
}

util.inherits(BufferType, Type);

eval('BufferType.prototype.validate = ' + BufferType.prototype.validate.toString());
// utils.copyPrototype(Type.prototype, BufferType.prototype);

BufferType.prototype._validate = function(value) {
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

module.exports = function(rules) {
  return new BufferType(rules);
};
