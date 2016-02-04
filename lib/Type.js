'use strict';

var ut = require('utjs');

function Type(rules) {
  rules = ut.isPlainObject(rules) ? rules : {};
  this._rules = rules;
}

Type.prototype.validate = function(/* arg1, arg2, arg3, argN */) {
  for (var i = 0; i < arguments.length; i++) {
    if (!this._validate(arguments[i])) {
      return i;
    }
  }

  return -1;
};

Type.prototype.validateList = function(valuesList) {
  for (var i = 0; i < valuesList.length; i++) {
    if (!this._validate(valuesList[i])) {
      return i;
    }
  }

  return -1;
};

Type.prototype._isAllowed = function(value) {
  var rules = this._rules;
  return rules.undef && value === undefined || rules.null && value === null;
};

module.exports = Type;
