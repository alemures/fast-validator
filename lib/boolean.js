'use strict';

var util = require('util');

var Type = require('./Type');

/**
 * Generates a schema object that matches a boolean data type.
 *
 * @constructor
 * @extends Type
 */
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

/**
 * Creates and returns a BooleanType object.
 * @return {BooleanType} The BooleanType object.
 * @global
 * @alias boolean
 */
module.exports = function boolean() {
  return new BooleanType();
};
