'use strict';

var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

/**
 * Creates a schema to validate arrays.
 *
 * @constructor
 * @extends Type
 */
function ArrayType() {
  ArrayType.super_.call(this);
}

util.inherits(ArrayType, Type);

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

ArrayType.prototype.sparse = function (enabled) {
  this._rules.sparse = ut.isBoolean(enabled) ? enabled : true;
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
    return !rules.required && value === undefined;
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
  var checked = new Array(items.length);

  var found;
  for (var i = 0; i < value.length; i++) {
    found = false;
    for (var j = 0; j < items.length && !found; j++) {
      if (this._rules.sparse && value[i] === undefined) {
        found = true;
      } else if (value[i] !== undefined && items[j].validate(value[i])) {
        found = true;
        checked[j] = true;
      }
    }

    if (!found) {
      return false;
    }
  }

  for (i = 0; i < items.length; i++) {
    if (items[i]._rules.required && !checked[i]) {
      return false;
    }
  }

  return true;
};

/**
 * Creates and returns an ArrayType object.
 * @return {ArrayType} The ArrayType object.
 * @global
 * @alias array
 */
module.exports = function array() {
  return new ArrayType();
};
