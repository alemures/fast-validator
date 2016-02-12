'use strict';

var util = require('util');

var Type = require('./Type');

function DateType(rules) {
  DateType.super_.call(this, DateType.NAME, rules);

  if (rules !== undefined) {
    if (rules.min !== undefined) {
      this._minTs = rules.min.getTime();
    }

    if (rules.max !== undefined) {
      this._maxTs = rules.max.getTime();
    }
  }
}

util.inherits(DateType, Type);

DateType.NAME = 'Date';

DateType.prototype.min = function (limit) {
  this._rules.min = limit;
  this._minTs = limit.getTime();
  return this;
};

DateType.prototype.max = function (limit) {
  this._rules.max = limit;
  this._maxTs = limit.getTime();
  return this;
};

DateType.prototype._validate = function (value) {
  var rules = this._rules;

  if (value instanceof Date === false) {
    return this._isAllowed(value);
  }

  var min = rules.min;
  var max = rules.max;

  var valueTs = value.getTime();

  if (min !== undefined && valueTs < this._minTs ||
      max !== undefined && valueTs > this._maxTs) {
    return false;
  }

  return true;
};

module.exports = function (rules) {
  return new DateType(rules);
};
