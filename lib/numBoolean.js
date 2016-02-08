'use strict';

var util = require('util');

var Type = require('./Type');
var utils = require('./utils');

function NumBooleanType(rules) {
  NumBooleanType.super_.call(this, rules);
}

util.inherits(NumBooleanType, Type);

eval('NumBooleanType.prototype.validate = ' + NumBooleanType.prototype.validate.toString());
// utils.copyFunction(Type.prototype.validate, NumBooleanType, 'validate');

NumBooleanType.prototype._validate = function(value) {
  if (typeof value !== 'number') {
    return this._isAllowed(value);
  }

  return value === 0 || value === 1;
};

module.exports = function(rules) {
  return new NumBooleanType(rules);
};
