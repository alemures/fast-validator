'use strict';

var util = require('util');

var Type = require('./Type');

function NumBooleanType() {
  NumBooleanType.super_.call(this, NumBooleanType.NAME);
}

util.inherits(NumBooleanType, Type);

NumBooleanType.NAME = 'NumBoolean';

NumBooleanType.prototype._validate = function (value) {
  if (typeof value !== 'number') {
    return this._isAllowed(value);
  }

  return value === 0 || value === 1;
};

module.exports = function () {
  return new NumBooleanType();
};
