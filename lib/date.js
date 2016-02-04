'use strict';

var util = require('util');

var Type = require('./Type');

function DateType(rules) {
  DateType.super_.call(this, rules);

  if (rules.min !== undefined) {
    this.minTs = rules.min.getTime();
  }

  if (rules.max !== undefined) {
    this.maxTs = rules.max.getTime();
  }
}

util.inherits(DateType, Type);

DateType.prototype._validate = function(value) {
  var rules = this._rules;

  if (value instanceof Date === false) {
    return this._isAllowed(value);
  }

  var min = rules.min;
  var max = rules.max;

  var valueTs = value.getTime();

  if (min !== undefined && valueTs < this.minTs ||
      max !== undefined && valueTs > this.maxTs) {
    return false;
  }

  return true;
};

module.exports = function(rules) {
  return new DateType(rules);
};
