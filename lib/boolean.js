'use strict';

var util = require('util');

var Type = require('./Type');
var utils = require('./utils');

function BooleanType(rules) {
  BooleanType.super_.call(this, rules);
}

util.inherits(BooleanType, Type);

eval('BooleanType.prototype.validate = ' + BooleanType.prototype.validate.toString());
// utils.copyPrototype(Type.prototype, BooleanType.prototype);

BooleanType.prototype._validate = function(value) {
  if (typeof value !== 'boolean') {
    return this._isAllowed(value);
  }

  return true;
};

module.exports = function(rules) {
  return new BooleanType(rules);
};
