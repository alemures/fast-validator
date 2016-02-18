'use strict';

var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

function DateType() {
  DateType.super_.call(this, DateType.NAME, this._hooks());
}

util.inherits(DateType, Type);

DateType.NAME = 'Date';

DateType.prototype.min = function (limit) {
  this._rules.min = this._toDate(limit);
  this._minTs = this._rules.min.getTime();
  return this;
};

DateType.prototype.max = function (limit) {
  this._rules.max = this._toDate(limit);
  this._maxTs = this._rules.max.getTime();
  return this;
};

DateType.prototype.iso = function () {
  this._rules.iso = true;
  return this;
};

DateType.prototype.timestamp = function (type) {
  type = type !== undefined ? type : 'javascript';
  this._rules.timestamp = type;
  return this;
};

DateType.prototype._validate = function (value) {
  var rules = this._rules;

  if (value instanceof Date === false) {
    if (typeof value === 'number') {
      if (rules.timestamp !== undefined && rules.timestamp === 'unix') {
        value *= 1000;
      }

      value = new Date(value);
    } else if (rules.timestamp === undefined && ut.isDateString(value)) {
      value = new Date(value);
    } else {
      return !rules.required && value === undefined;
    }
  }

  var min = rules.min;
  var max = rules.max;

  var valueTs = value.getTime();

  if (min !== undefined && valueTs < this._minTs ||
      max !== undefined && valueTs > this._maxTs) {
    return false;
  }

  return rules.forbidden ? false : true;
};

DateType.prototype._toDate = function (value) {
  if (value instanceof Date) {
    return value;
  } else if (typeof value === 'number' || ut.isDateString(value)) {
    return new Date(value);
  }

  return null;
};

DateType.prototype._hooks = function () {
  return {
    post: function (rules) {
      if (rules !== undefined) {
        if (rules.min !== undefined) {
          this._minTs = rules.min.getTime();
        }

        if (rules.max !== undefined) {
          this._maxTs = rules.max.getTime();
        }
      }
    }
  };
};

module.exports = function () {
  return new DateType();
};
