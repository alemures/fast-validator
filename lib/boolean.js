'use strict';

var util = require('util');

var Type = require('./Type');

function BooleanType(rules) {
  BooleanType.super_.call(this, BooleanType.NAME, rules);
}

util.inherits(BooleanType, Type);

BooleanType.NAME = 'Boolean';

BooleanType.prototype._validate = function (value) {
  if (typeof value !== 'boolean') {
    return this._isAllowed(value);
  }

  return true;
};

module.exports = function (rules) {
  return new BooleanType(rules);
};
