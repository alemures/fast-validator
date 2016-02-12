'use strict';

var ut = require('utjs');

function Type(dataType, rules) {
  this._dataType = dataType;

  this._rules = { _dataType: dataType };
  this.mergeRules(rules);

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

Type.prototype.getRules = function () {
  return ut.cloneObject(this._rules);
};

Type.prototype.setRules = function (rules) {
  if (ut.isPlainObject(rules)) {
    this._rules = rules;
  }
};

Type.prototype.mergeRules = function (rules) {
  if (ut.isPlainObject(rules)) {
    ut.mergeObjects(this._rules, rules);
  }
};

Type.prototype.toString = function () {
  return JSON.stringify(this._rules);
};

Type.prototype._isAllowed = function (value) {
  var rules = this._rules;
  return rules.undef && value === undefined || rules.null && value === null;
};

// Trick to create copies of the most used methods by the subclasses.
// Using a full copy of the same methods in different objects allows
// v8 to optimize them separately so the validation process is x2 faster.

var _funcNames = ['validate', 'validateList', '_isAllowed'];
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
