'use strict';

var assert = require('assert');
var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

/**
 * Generates a schema object that matches an object data type.
 *
 * @constructor
 * @extends Type
 */
function ObjectType() {
  ObjectType.super_.call(this);
}

util.inherits(ObjectType, Type);

/**
 * Specifies the minimum number of keys in the object.
 * @param  {Number} limit The lowest number of keys allowed.
 * @return {ObjectType} The class reference so multiple calls can be chained.
 */
ObjectType.prototype.min = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

  this._rules.min = limit;
  return this;
};

/**
 * Specifies the maximum number of keys in the object.
 * @param  {Number} limit The highest number of keys allowed.
 * @return {ObjectType} The class reference so multiple calls can be chained.
 */
ObjectType.prototype.max = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

  this._rules.max = limit;
  return this;
};

/**
 * Specifies the exact number of keys in the object.
 * @param  {Number} limit The number of object keys allowed.
 * @return {ObjectType} The class reference so multiple calls can be chained.
 */
ObjectType.prototype.length = function (limit) {
  assert(ut.isInteger(limit) && limit >= 0, 'limit must be a positive integer');

  this._rules.length = limit;
  return this;
};

/**
 * Sets the allowed object keys.
 * @param  {Object} keys Object where each key is assigned a joi type object.
 * @return {ObjectType} The class reference so multiple calls can be chained.
 */
ObjectType.prototype.keys = function (keys) {
  assert(ut.isPlainObject(keys), 'keys must be a plain object');

  this._rules.keys = keys;
  return this;
};

/**
 * Requires the object to be an instance of a given constructor
 * @param  {Function} constructor The constructor function that the object must be an instance of.
 * @return {ObjectType} The class reference so multiple calls can be chained.
 */
ObjectType.prototype.type = function (constructor) {
  assert(ut.isFunction(constructor), 'type must be a constructor function');

  this._rules.type = constructor;
  return this;
};

ObjectType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'object' || value === null) {
    return !rules.required && value === undefined;
  }

  if (!this._validateLength(value)) {
    return false;
  }

  if (rules.type !== undefined && value instanceof rules.type === false) {
    return false;
  }

  if (rules.keys !== undefined && !this._validateKeys(value, rules.keys)) {
    return false;
  }

  return rules.forbidden ? false : true;
};

ObjectType.prototype._validateLength = function (value) {
  var rules = this._rules;
  var length = -1;

  if (rules.min !== undefined) {
    length = ut.objectLength(value);

    if (length < rules.min) {
      return false;
    }
  }

  if (rules.max !== undefined) {
    if (length === -1) {
      length = ut.objectLength(value);
    }

    if (length > rules.max) {
      return false;
    }
  }

  if (rules.ruleLength !== undefined) {
    if (length === -1) {
      length = ut.objectLength(value);
    }

    if (length !== rules.ruleLength) {
      return false;
    }
  }

  return true;
};

ObjectType.prototype._validateKeys = function (value, keys) {
  var checked = {};
  var i;

  for (i in value) {
    if (keys[i] !== undefined && !keys[i].validate(value[i])) {
      return false;
    }

    checked[i] = 1;
  }

  for (i in keys) {
    if (keys[i]._rules.required && checked[i] === undefined) {
      return false;
    }
  }

  return true;
};

/**
 * Creates and returns a ObjectType object.
 * @return {ObjectType} The ObjectType object.
 * @global
 * @alias object
 */
module.exports = function object() {
  return new ObjectType();
};
