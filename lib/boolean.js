'use strict';

var Type = require('./Type');
var utils = require('./utils');

function BooleanType(rules) {
  BooleanType.super_.call(this, rules);
}

utils.hardInherits(BooleanType, Type);

BooleanType.prototype._validate = function (value) {
  if (typeof value !== 'boolean') {
    return this._isAllowed(value);
  }

  return true;
};

module.exports = function (rules) {
  return new BooleanType(rules);
};
