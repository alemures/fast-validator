'use strict';

var assert = require('assert');
var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

/**
 * Generates a schema object that matches a Buffer data type
 *
 * @constructor
 * @extends Type
 */
function BufferType() {
  BufferType.super_.call(this);
}

util.inherits(BufferType, Type);

/**
 * Specifies the minimum length of the buffer.
 * @param  {Number} limit The lowest size of the buffer.
 * @return {BufferType} The class reference so multiple calls can be chained.
 */
BufferType.prototype.min = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

  this._rules.min = limit;
  return this;
};

/**
 * Specifies the maximum length of the buffer.
 * @param  {Number} limit The highest size of the buffer.
 * @return {BufferType} The class reference so multiple calls can be chained.
 */
BufferType.prototype.max = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

  this._rules.max = limit;
  return this;
};

/**
 * Specifies the exact length of the buffer.
 * @param  {Number} limit  The size of buffer allowed.
 * @return {BufferType} The class reference so multiple calls can be chained.
 */
BufferType.prototype.length = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

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

/**
 * Creates and returns a BufferType object.
 * @return {BufferType} The BufferType object.
 * @global
 * @alias buffer
 */
module.exports = function buffer() {
  return new BufferType();
};
