'use strict';

var util = require('util');

var Type = require('./Type');

function BooleanType() {
  BooleanType.super_.call(this);
}

util.inherits(BooleanType, Type);

BooleanType.prototype._validate = function (value) {
  var rules = this._rules;

  if (typeof value !== 'boolean') {
    return !rules.required && value === undefined;
  }

  return rules.forbidden ? false : true;
};

module.exports = function () {
  return new BooleanType();
};
