'use strict';

var ut = require('utjs');

var Type = require('./Type');

function BooleanType(rules) {
  BooleanType.super_.call(this, rules);
}

ut.hardInherits(BooleanType, Type);

BooleanType.prototype._validate = function (value) {
  if (typeof value !== 'boolean') {
    return this._isAllowed(value);
  }

  return true;
};

module.exports = function (rules) {
  return new BooleanType(rules);
};
