'use strict';

var util = require('util');

var Type = require('./Type');

function BooleanType() {
  BooleanType.super_.call(this, BooleanType.NAME);
}

util.inherits(BooleanType, Type);

BooleanType.NAME = 'Boolean';

BooleanType.prototype._validate = function (value) {
  if (typeof value !== 'boolean') {
    return this._isAllowed(value);
  }

  return true;
};

module.exports = function () {
  return new BooleanType();
};
