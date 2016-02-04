'use strict';

var util = require('util');

var Type = require('./Type');

function NumBooleanType(rules) {
  NumBooleanType.super_.call(this, rules);
}

util.inherits(NumBooleanType, Type);

NumBooleanType.prototype._validate = function(value) {
  if (typeof value !== 'number') {
    return this._isAllowed(value);
  }

  return value === 0 || value === 1;
};

module.exports = function(rules) {
  return new NumBooleanType(rules);
};
