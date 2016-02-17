'use strict';

var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

function ArrayType() {
  ArrayType.super_.call(this, ArrayType.NAME);
}

util.inherits(ArrayType, Type);

ArrayType.NAME = 'Array';

ArrayType.prototype.min = function (limit) {
  this._rules.min = limit;
  return this;
};

ArrayType.prototype.max = function (limit) {
  this._rules.max = limit;
  return this;
};

ArrayType.prototype.length = function (limit) {
  this._rules.length = limit;
  return this;
};

ArrayType.prototype.items = function (type) {
  this._rules.items = Array.isArray(type) ? type :
      ut.argumentsToArray(arguments);
  return this;
};

ArrayType.prototype._validate = function (value) {
  var rules = this._rules;

  if (!Array.isArray(value)) {
    return this._isAllowed(value);
  }

  var min = rules.min;
  var max = rules.max;
  var length = rules.length;
  var items = rules.items;

  var valueLength = value.length;

  if (min !== undefined && valueLength < min ||
      max !== undefined && valueLength > max) {
    return false;
  }

  if (length !== undefined && valueLength !== length) {
    return false;
  }

  if (items !== undefined && !this._validateItems(value, items)) {
    return false;
  }

  return rules.forbidden ? false : true;
};

ArrayType.prototype._validateItems = function (value, items) {
  if (items.length === 1) {
    return items[0].validateList(value) === -1;
  }

  var found;
  for (var i = 0; i < value.length; i++) {
    found = false;
    for (var j = 0; j < items.length && !found; j++) {
      if (items[j].validate(value[i])) {
        found = true;
      }
    }

    if (!found) {
      return false;
    }
  }

  return true;
};

module.exports = function () {
  return new ArrayType();
};
