'use strict';

var assert = require('assert');

var ut = require('utjs');

/**
 * Represents a generic schema.
 *
 * @constructor
 * @abstract
 */
function Type(hooks) {
  hooks = hooks !== undefined ? hooks : {};

  this._rules = {};
  this._hooks = hooks;

  _cacheFunctions(this);
}

/**
 * Validates the passed arguments.
 * @param {...*} value The value.
 * @return {Boolean} Returns true if all arguments are successfully validated, else false.
 */
Type.prototype.validate = function (value) {
  for (var i = 0; i < arguments.length; i++) {
    if (!this._validateValue(arguments[i], this._rules.valid,
        this._rules.invalid, this._rules.onlyValid)) {
      return false;
    }
  }

  return true;
};

/**
 * Validates an array of values.
 * @param {Array.<*>} valuesList The array of values.
 * @return {Boolean} Returns true if all elements in the array are successfully
 *                   validated, else false.
 */
Type.prototype.validateList = function (valuesList) {
  for (var i = 0; i < valuesList.length; i++) {
    if (!this._validateValue(valuesList[i], this._rules.valid,
        this._rules.invalid, this._rules.onlyValid)) {
      return false;
    }
  }

  return true;
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

/**
 * Marks a key as required which will not allow undefined as value.
 * All keys are optional by default.
 * @return {Type} The class reference so multiple calls can be chained.
 */
Type.prototype.required = function () {
  this._rules.required = true;
  return this;
};

/**
 * Marks a key as optional which will allow undefined as values.
 * Used to annotate the schema for readability as all keys are optional by default.
 * @return {Type} The class reference so multiple calls can be chained.
 */
Type.prototype.optional = function () {
  this._rules.required = false;
  return this;
};

/**
 * Marks a key as forbidden which will not allow any value except undefined.
 * Used to explicitly forbid keys.
 * @return {Type} The class reference so multiple calls can be chained.
 */
Type.prototype.forbidden = function () {
  this._rules.forbidden = true;
  return this;
};

/**
 * Whitelists the provided values.
 * @param {...*|Array.<*>} value The values to add to the whitelist. It can be
 *                               an array of values, or multiple values can be passed
 *                               as individual arguments.
 * @return {Type} The class reference so multiple calls can be chained.
 */
Type.prototype.allow = function (value) {
  var values = Array.isArray(value) ? value :
      ut.argumentsToArray(arguments);

  if (this._rules.valid === undefined) {
    this._rules.valid = new Set();
  }

  var valid = this._rules.valid;

  for (var i = 0; i < values.length; i++) {
    assert(values[i] !== undefined, 'Cannot call allow/valid/invalid with undefined');

    valid.add(values[i]);
  }

  return this;
};

/**
 * Adds the provided values into the allowed whitelist and marks them as the only
 * valid values allowed.
 * @param {...*|Array.<*>} value The values to add to the whitelist. It can be
 *                               an array of values, or multiple values can be passed
 *                               as individual arguments.
 * @return {Type} The class reference so multiple calls can be chained.
 * @function
 */
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

/**
 * Blacklists the provided values.
 * @param {...*|Array.<*>} value The values to add to the blacklist. It can be
 *                               an array of values, or multiple values can be passed
 *                               as individual arguments.
 * @return {Type} The class reference so multiple calls can be chained.
 * @function
 */
Type.prototype.invalid  =
Type.prototype.disallow =
Type.prototype.not      = function (value) {
  var values = Array.isArray(value) ? value :
      ut.argumentsToArray(arguments);

  if (this._rules.invalid === undefined) {
    this._rules.invalid = new Set();
  } else {
    this._rules.invalid.clear();
  }

  var invalid = this._rules.invalid;

  for (var i = 0; i < values.length; i++) {
    assert(values[i] !== undefined, 'Cannot call allow/valid/invalid with undefined');

    invalid.add(values[i]);
  }

  return this;
};

/**
 * Gets a cloned version of the internal rules of this type.
 * @return {Object} The internal rules.
 */
Type.prototype.getRules = function () {
  return ut.cloneObject(this._rules);
};

/**
 * Sets the internal rules of this type using a plain object.
 * @param {Object} rules Internal rules as a plain object.
 * @return {Type} The class reference so multiple calls can be chained.
 */
Type.prototype.setRules = function (rules) {
  this._preHook(rules);
  this._rules = rules;
  this._postHook(rules);

  return this;
};

/**
 * Merges the internal rules of this type with the argument passed.
 * @param {Object} rules Internal rules as a plain object.
 * @return {Type} The class reference so multiple calls can be chained.
 */
Type.prototype.mergeRules = function (rules) {
  this._preHook(rules);
  ut.mergeObjects(this._rules, rules);
  this._postHook(rules);

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
  var funcs = _funcCache[_this.constructor.name];
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
