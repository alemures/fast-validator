'use strict';

var ut = require('utjs');

function Type(dataType, hooks) {
  hooks = hooks !== undefined ? hooks : {};

  this._dataType = dataType;
  this._rules = {};
  this._hooks = hooks;

  _cacheFunctions(this);
}

Type.prototype.validate = function (/* arg1, arg2, arg3, argN */) {
  for (var i = 0; i < arguments.length; i++) {
    if (!this._validateValue(arguments[i], this._rules.valid,
        this._rules.invalid, this._rules.onlyValid)) {
      return i;
    }
  }

  return -1;
};

Type.prototype.validateList = function (valuesList) {
  for (var i = 0; i < valuesList.length; i++) {
    if (!this._validateValue(valuesList[i], this._rules.valid,
        this._rules.invalid, this._rules.onlyValid)) {
      return i;
    }
  }

  return -1;
};

Type.prototype._validateValue = function (value, valid, invalid, onlyValid) {
  if (invalid !== undefined && invalid.has(value)) {
    return false;
  }

  if (onlyValid) {
    if (valid === undefined || !valid.has(value)) {
      return false;
    }
  } else if (!this._validate(value) &&
      (valid === undefined || !valid.has(value))) {
    return false;
  }

  return true;
};

Type.prototype.required = function () {
  this._rules.required = true;
  return this;
};

Type.prototype.optional = function () {
  this._rules.required = false;
  return this;
};

Type.prototype.forbidden = function () {
  this._rules.forbidden = true;
  return this;
};

Type.prototype.allow = function (value) {
  var values = Array.isArray(value) ? value :
      ut.argumentsToArray(arguments);

  if (this._rules.valid === undefined) {
    this._rules.valid = new Map();
  }

  var valid = this._rules.valid;

  for (var i = 0; i < values.length; i++) {
    valid.set(values[i], 1);
  }

  return this;
};

Type.prototype.valid =
Type.prototype.only  =
Type.prototype.equal = function (value) {
  var values = Array.isArray(value) ? value :
      ut.argumentsToArray(arguments);

  this._rules.onlyValid = true;

  if (this._rules.valid !== undefined) {
    this._rules.valid.clear();
  }

  this.allow(values);
  return this;
};

Type.prototype.invalid  =
Type.prototype.disallow =
Type.prototype.not      = function (value) {
  var values = Array.isArray(value) ? value :
      ut.argumentsToArray(arguments);

  if (this._rules.invalid === undefined) {
    this._rules.invalid = new Map();
  } else {
    this._rules.invalid.clear();
  }

  var invalid = this._rules.invalid;

  for (var i = 0; i < values.length; i++) {
    invalid.set(values[i], 1);
  }

  return this;
};

Type.prototype.getRules = function () {
  return ut.cloneObject(this._rules);
};

Type.prototype.setRules = function (rules) {
  if (ut.isPlainObject(rules)) {
    this._preHook(rules);
    this._rules = rules;
    this._postHook(rules);
  }

  return this;
};

Type.prototype.mergeRules = function (rules) {
  if (ut.isPlainObject(rules)) {
    this._preHook(rules);
    ut.mergeObjects(this._rules, rules);
    this._postHook(rules);
  }

  return this;
};

Type.prototype._preHook = function (rules) {
  var hook = this._hooks.pre;
  if (hook !== undefined) {
    hook.call(this, rules);
  }
};

Type.prototype._postHook = function (rules) {
  var hook = this._hooks.post;
  if (hook !== undefined) {
    hook.call(this, rules);
  }
};

// Trick to create copies of the most used methods by the subclasses.
// Using a full copy of the same methods in different objects allows
// v8 to optimize them separately so the validation process is x2 faster.

var _funcNames = ['validate', 'validateList', '_validateValue'];
var _funcCache = {};
var _copyFunctionCounter = 0;

function _cacheFunctions(_this) {
  var funcs = _funcCache[_this._dataType];
  var name;
  var i;

  if (funcs !== undefined) {
    for (i = 0; i < _funcNames.length; i++) {
      name = _funcNames[i];
      _this[name] = funcs[name];
    }
  } else {
    _funcCache[_this.constructor.name] = {};
    for (i = 0; i < _funcNames.length; i++) {
      name = _funcNames[i];
      /*jshint evil:true*/
      eval('_this.' + name + ' = ' + _renameFunction(_this[name].toString(), name));
      /*jshint evil:false*/
      _funcCache[_this.constructor.name][name] = _this[name];
    }
  }
}

function _renameFunction(func, name) {
  var funcName = name + '_' + (++_copyFunctionCounter);
  var funcRenamed = 'function ' + funcName + func.substring(func.indexOf('('));
  return funcRenamed;
}

module.exports = Type;
