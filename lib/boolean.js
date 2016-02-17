'use strict';

var util = require('util');

var Type = require('./Type');

function BooleanType() {
  BooleanType.super_.call(this, BooleanType.NAME);
}

util.inherits(BooleanType, Type);

BooleanType.NAME = 'Boolean';

BooleanType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'boolean') {
    return this._isAllowed(value);
  }

  return rules.forbidden ? false : true;
};

module.exports = function () {
  return new BooleanType();
};
