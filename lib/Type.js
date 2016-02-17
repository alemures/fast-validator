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
    if (!this._validate(arguments[i])) {
      return i;
    }
  }

  return -1;
};

Type.prototype.validateList = function (valuesList) {
  for (var i = 0; i < valuesList.length; i++) {
    if (!this._validate(valuesList[i])) {
      return i;
    }
  }

  return -1;
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

var _funcNames = ['validate', 'validateList'];
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
