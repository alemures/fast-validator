'use strict';

var util = require('util');

var Type = require('./Type');

function StringType(rules) {
  StringType.super_.call(this, StringType.NAME, rules);
}

util.inherits(StringType, Type);

StringType.NAME = 'String';

StringType.prototype.min = function (limit) {
  this._rules.min = limit;
  return this;
};

StringType.prototype.max = function (limit) {
  this._rules.max = limit;
  return this;
};

StringType.prototype.length = function (limit) {
  this._rules.length = limit;
  return this;
};

StringType.prototype.regex = function (pattern) {
  this._rules.regex = pattern;
  return this;
};

StringType.prototype.isoDate = function () {
  this._rules.isoDate = true;
  return this;
};

StringType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'string') {
    return this._isAllowed(value);
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

  if (isoDate && !this._validateIsoDate(value)) {
    return false;
  }

  return true;
};

StringType.prototype._validateIsoDate = function (value) {
  var date = new Date(value);
  return !isNaN(date.getTime());
};

module.exports = function (rules) {
  return new StringType(rules);
};
