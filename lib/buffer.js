'use strict';

var util = require('util');

var Type = require('./Type');

function BufferType() {
  BufferType.super_.call(this);
}

util.inherits(BufferType, Type);

BufferType.prototype.min = function (limit) {
  this._rules.min = limit;
  return this;
};

BufferType.prototype.max = function (limit) {
  this._rules.max = limit;
  return this;
};

BufferType.prototype.length = function (limit) {
  this._rules.length = limit;
  return this;
};

BufferType.prototype._validate = function (value) {
  var rules = this._rules;

  if (value instanceof Buffer === false) {
    return !rules.required && value === undefined;
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

  return rules.forbidden ? false : true;
};

module.exports = function () {
  return new BufferType();
};
