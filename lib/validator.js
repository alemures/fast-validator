'use strict';

/**
 * Validate the values against a set of rules.
 * @param {String[]|Number[]|Boolean[]|
 *        Object[]|Array[]} values  The array of values to validate.
 * @param {Object} rules The rules.
 * @param {String} rules.type Define the data type.
 * @param {Number} [rules.min] The minimum value.
 * @param {Number} [rules.max] The maximum value.
 * @param {Boolean} [rules.undef] Allow undefined values.
 * @param {Boolean} [rules.null] Allow null values.
 * @return {Number}         Returns -1 if all values are correct or the index
 *                          of the first incorrect value.
 */
function validate(values, rules) {
  for (var i = 0; i < values.length; i++) {
    if (!_validate(values[i], rules)) {
      return i;
    }
  }

  return -1;
}

function _validate(value, rules) {
  switch (rules.type) {
    case 'number':
      if (typeof value === 'number') {
        return _number(value, rules);
      }

      break;
    case 'string':
      if (typeof value === 'string') {
        return _string(value, rules);
      }

      break;
    case 'array':
      if (Array.isArray(value)) {
        return _array(value, rules);
      }

      break;
    case 'object':
      if (typeof value === 'object') {
        return _object(value, rules);
      }

      break;
    case 'num_boolean':
      return value === 0 || value === 1;
    case 'boolean':
      return typeof value === 'boolean';
  }

  if (rules.undef && value === undefined ||
      rules.null && value === null) {
    return true;
  }

  return false;
}

function _object(value, rules) {
  var min = rules.min;
  var max = rules.max;
  var length = -1;

  if (min !== undefined) {
    length = _objectLength(value);

    if (length < min) {
      return false;
    }
  }

  if (max !== undefined) {
    if (length === -1) {
      length = _objectLength(value);
    }

    if (length > max) {
      return false;
    }
  }

  return true;
}

function _number(value, rules) {
  var min = rules.min;
  var max = rules.max;

  if (min !== undefined && value < min ||
      max !== undefined && value > max) {
    return false;
  }

  return true;
}

function _string(value, rules) {
  var min = rules.min;
  var max = rules.max;

  if (min !== undefined && value.length < min ||
      max !== undefined && value.length > max) {
    return false;
  }

  return true;
}

function _array(value, rules) {
  var min = rules.min;
  var max = rules.max;

  if (min !== undefined && value.length < min ||
      max !== undefined && value.length > max) {
    return false;
  }

  return true;
}

function _objectLength(object) {
  /*jshint unused: false*/
  var length = 0;
  for (var i in object) {
    length++;
  }

  return length;
}

module.exports.validate = validate;

/**
 * The number type.
 * @type {String}
 */
module.exports.NUMBER = 'number';

/**
 * The string type.
 * @type {String}
 */
module.exports.STRING = 'string';

/**
 * The boolean type.
 * @type {String}
 */
module.exports.BOOLEAN = 'boolean';

/**
 * The array type.
 * @type {String}
 */
module.exports.ARRAY = 'array';

/**
 * The object type.
 * @type {String}
 */
module.exports.OBJECT = 'object';

/**
 * The numeric value type.
 * @type {String}
 */
module.exports.NUM_BOOLEAN = 'num_boolean';
