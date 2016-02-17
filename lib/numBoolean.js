'use strict';

var util = require('util');

var Type = require('./Type');

function NumBooleanType() {
  NumBooleanType.super_.call(this, NumBooleanType.NAME);
}

util.inherits(NumBooleanType, Type);

NumBooleanType.NAME = 'NumBoolean';

NumBooleanType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'number') {
    return this._isAllowed(value);
  }

  return (value === 0 || value === 1) && !rules.forbidden;
};

module.exports = function () {
  return new NumBooleanType();
};
