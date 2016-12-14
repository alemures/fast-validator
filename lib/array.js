'use strict';

var assert = require('assert');
var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

/**
 * Generates a schema object that matches an array data type.
 * Note that undefined values inside arrays are not allowed
 * by default but can be by using sparse().
 *
 * @constructor
 * @extends Type
 */
function ArrayType() {
  ArrayType.super_.call(this);
}

util.inherits(ArrayType, Type);

/**
 * Specifies the minimum number of items in the array.
 * @param  {Number} limit The lowest number of array items allowed.
 * @return {ArrayType} The class reference so multiple calls can be chained.
 */
ArrayType.prototype.min = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

  this._rules.min = limit;
  return this;
};

/**
 * Specifies the maximum number of items in the array.
 * @param  {Number} limit The highest number of array items allowed.
 * @return {ArrayType} The class reference so multiple calls can be chained.
 */
ArrayType.prototype.max = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

  this._rules.max = limit;
  return this;
};

/**
 * Specifies the exact number of items in the array.
 * @param  {Number} limit The number of array items allowed.
 * @return {ArrayType} The class reference so multiple calls can be chained.
 */
ArrayType.prototype.length = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

  this._rules.length = limit;
  return this;
};

/**
 * Allow this array to be sparse.
 * @param  {Boolean} [enabled] Can be used with a falsy value to go back
 *                             to the default behavior.
 * @return {ArrayType} The class reference so multiple calls can be chained.
 */
ArrayType.prototype.sparse = function (enabled) {
  this._rules.sparse = enabled === undefined ? true : !!enabled;
  return this;
};

/**
 * List the types allowed for the array values.
 * @param  {...Type|Array.<Type>} type A schema object to validate each array item against.
 *                                     Type can be an array of values, or multiple values
 *                                     can be passed as individual arguments.
 * @return {ArrayType} The class reference so multiple calls can be chained.
 */
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

  if (items !== undefined ? !this._validateItemsAndSparse(value, items) :
      !this._validateSparse(value)) {
    return false;
  }

  return rules.forbidden ? false : true;
};

// It's x2 faster than Array#_validateItemsAndSparse when no items are provided
ArrayType.prototype._validateSparse = function (value) {
  if (!this._rules.sparse) {
    for (var i = 0; i < value.length; i++) {
      if (value[i] === undefined) {
        return false;
      }
    }
  }

  return true;
};

ArrayType.prototype._validateItemsAndSparse = function (value, items) {
  var checked = new Array(items.length);

  for (var i = 0; i < value.length; i++) {
    if (value[i] === undefined) {
      if (!this._rules.sparse) {
        return false;
      }
    } else {
      var found = false;
      for (var j = 0; j < items.length && !found; j++) {
        if (items[j].validate(value[i])) {
          found = true;
          checked[j] = true;
        }
      }

      if (!found) {
        return false;
      }
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
