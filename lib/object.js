'use strict';

var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

function ObjectType(rules) {
  ObjectType.super_.call(this, ObjectType.NAME, rules);
}

util.inherits(ObjectType, Type);

ObjectType.NAME = 'Object';

ObjectType.prototype.min = function (limit) {
  this._rules.min = limit;
  return this;
};

ObjectType.prototype.max = function (limit) {
  this._rules.max = limit;
  return this;
};

ObjectType.prototype.length = function (limit) {
  this._rules.length = limit;
  return this;
};

ObjectType.prototype.keys = function (keys) {
  this._rules.keys = keys;
  return this;
};

ObjectType.prototype.type = function (constructor) {
  this._rules.type = constructor;
  return this;
};

ObjectType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'object') {
    return this._isAllowed(value);
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

  return true;
};

ObjectType.prototype._validateKeys = function (value, keys) {
  for (var i = 0; i < keys.length; i++) {
    if (value[keys[i]] === undefined) {
      return false;
    }
  }

  return true;
};

module.exports = function (rules) {
  return new ObjectType(rules);
};
