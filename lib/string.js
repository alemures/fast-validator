'use strict';

var Type = require('./Type');
var utils = require('./utils');

function StringType(rules) {
  StringType.super_.call(this, rules);
}

utils.hardInherits(StringType, Type);

StringType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'string') {
    return this._isAllowed(value);
  }

  var min = rules.min;
  var max = rules.max;
  var length = rules.length;
  var regex = rules.regex;

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

  return true;
};

module.exports = function (rules) {
  return new StringType(rules);
};
