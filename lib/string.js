'use strict';

var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

/**
 * Generates a schema object that matches a string data type.
 *
 * @constructor
 * @extends Type
 */
function StringType() {
  StringType.super_.call(this);
}

util.inherits(StringType, Type);

/**
 * Specifies the minimum number string characters.
 * @param  {Number} limit The minimum number of string characters required.
 * @return {StringType} The class reference so multiple calls can be chained.
 */
StringType.prototype.min = function (limit) {
  this._rules.min = limit;
  return this;
};

/**
 * Specifies the maximum number string characters.
 * @param  {Number} limit The maximum number of string characters required.
 * @return {StringType} The class reference so multiple calls can be chained.
 */
StringType.prototype.max = function (limit) {
  this._rules.max = limit;
  return this;
};

/**
 * Specifies the exact string length required.
 * @param  {Number} limit the required string length.
 * @return {StringType} The class reference so multiple calls can be chained.
 */
StringType.prototype.length = function (limit) {
  this._rules.length = limit;
  return this;
};

/**
 * Defines a regular expression rule.
 * @param  {RegExp} pattern a regular expression object the string value must match against.
 * @return {StringType} The class reference so multiple calls can be chained.
 */
StringType.prototype.regex = function (pattern) {
  this._rules.regex = pattern;
  return this;
};

/**
 * Requires the string value to be in valid ISO 8601 date format.
 * @return {StringType} The class reference so multiple calls can be chained.
 */
StringType.prototype.isoDate = function () {
  this._rules.isoDate = true;
  return this;
};

StringType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'string') {
    return !rules.required && value === undefined;
  }

  var min = rules.min;
  var max = rules.max;
  var length = rules.length;
  var regex = rules.regex;
  var isoDate = rules.isoDate;

  var valueLength = value.length;

  if (min !== undefined && valueLength < min ||
      max !== undefined && valueLength > max) {
    return false;
  }

  if (length !== undefined && valueLength !== length) {
    return false;
  }

  if (regex !== undefined && !regex.test(value)) {
    return false;
  }

  if (isoDate && !ut.isDateString(value)) {
    return false;
  }

  return rules.forbidden ? false : true;
};

/**
 * Creates and returns a StringType object.
 * @return {StringType} The StringType object.
 * @global
 * @alias string
 */
module.exports = function string() {
  return new StringType();
};
