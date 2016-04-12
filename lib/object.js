'use strict';

var util = require('util');

var ut = require('utjs');

var Type = require('./Type');

function ObjectType() {
  ObjectType.super_.call(this);
}

util.inherits(ObjectType, Type);

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

module.exports = function () {
  return new ObjectType();
};
