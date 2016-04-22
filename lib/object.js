'use strict';

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
  this._rules.min = limit;
  return this;
};

/**
 * Specifies the maximum number of keys in the object.
 * @param  {Number} limit The highest number of keys allowed.
 * @return {ObjectType} The class reference so multiple calls can be chained.
 */
ObjectType.prototype.max = function (limit) {
  this._rules.max = limit;
  return this;
};

/**
 * Specifies the exact number of keys in the object.
 * @param  {Number} limit The number of object keys allowed.
 * @return {ObjectType} The class reference so multiple calls can be chained.
 */
ObjectType.prototype.length = function (limit) {
  this._rules.length = limit;
  return this;
};

/**
 * Sets the allowed object keys.
 * @param  {Object} keys Object where each key is assigned a joi type object.
 * @return {ObjectType} The class reference so multiple calls can be chained.
 */
ObjectType.prototype.keys = function (keys) {
  this._rules.keys = keys;
  return this;
};

/**
 * Requires the object to be an instance of a given constructor
 * @param  {Function} constructor The constructor function that the object must be an instance of.
 * @return {ObjectType} The class reference so multiple calls can be chained.
 */
ObjectType.prototype.type = function (constructor) {
  this._rules.type = constructor;
  return this;
};

ObjectType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'object' || value === null) {
    return !rules.required && value === undefined;
  }

  var min = rules.min;
  var max = rules.max;
  var ruleLength = rules.length;
  var keys = rules.keys;
  var type = rules.type;

  var length = -1;

  if (min !== undefined) {
    length = ut.objectLength(value);

    if (length < min) {
      return false;
    }
  }

  if (max !== undefined) {
    if (length === -1) {
      length = ut.objectLength(value);
    }

    if (length > max) {
      return false;
    }
  }

  if (ruleLength !== undefined) {
    if (length === -1) {
      length = ut.objectLength(value);
    }

    if (length !== ruleLength) {
      return false;
    }
  }

  if (type !== undefined && value instanceof type === false) {
    return false;
  }

  if (keys !== undefined && !this._validateKeys(value, keys)) {
    return false;
  }

  return rules.forbidden ? false : true;
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
