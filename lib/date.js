'use strict';

var assert = require('assert');
var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

/**
 * Generates a schema object that matches a date type.
 *
 * @constructor
 * @extends Type
 */
function DateType() {
  DateType.super_.call(this, this._hooks());
}

util.inherits(DateType, Type);

/**
 * Specifies the oldest date allowed.
 * @param  {Date} date The oldest date allowed.
 * @return {DateType} The class reference so multiple calls can be chained.
 */
DateType.prototype.min = function (date) {
  date = this._toDate(date);

  assert(date !== null, 'date must be a Date, number or ISO string');

  this._rules.min = date;
  this._minTs = date.getTime();
  return this;
};

/**
 * Specifies the latest date allowed.
 * @param  {Date} date The latest date allowed.
 * @return {DateType} The class reference so multiple calls can be chained.
 */
DateType.prototype.max = function (date) {
  date = this._toDate(date);

  assert(date !== null, 'date must be a Date, number or ISO string');

  this._rules.max = date;
  this._maxTs = date.getTime();
  return this;
};

/**
 * Requires the string value to be in valid ISO 8601 date format.
 * @return {DateType} The class reference so multiple calls can be chained.
 */
DateType.prototype.iso = function () {
  this._rules.iso = true;
  return this;
};

/**
 * Requires the value to be a timestamp interval from Unix Time.
 * @param {String} [type] The type of timestamp (allowed values are unix or javascript [default]).
 * @return {DateType} The class reference so multiple calls can be chained.
 */
DateType.prototype.timestamp = function (type) {
  type = type !== undefined ? type : 'javascript';

  assert(type === 'javascript' || type === 'unix', 'type must be unix or javascript');

  this._rules.timestamp = type;
  return this;
};

DateType.prototype._validate = function (value) {
  var rules = this._rules;

  if (value instanceof Date === false) {
    if (rules.timestamp !== undefined && typeof value === 'number') {
      value = this._toDate(value);
    } else if (rules.iso && ut.isDateString(value)) {
      value = this._toDate(value);
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
  var rules = this._rules;

  if (value instanceof Date) {
    return value;
  } else if (typeof value === 'number') {
    value *= rules.timestamp === 'unix' ? 1000 : 1;
    return new Date(value);
  } else if (ut.isDateString(value)) {
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

/**
 * Creates and returns a DateType object.
 * @return {DateType} The DateType object.
 * @global
 * @alias date
 */
module.exports = function date() {
  return new DateType();
};
