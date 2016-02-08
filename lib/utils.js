'use strict';

function copyPrototype(orig, dest, pattern) {
  pattern = pattern !== undefined ? pattern : '.*';

  var regExp = new RegExp(pattern);
  var copy = {};

  for (var i in orig) {
    if (regExp.test(i)) {
      copyFunction(orig[i], dest, i);
    }
  }
};

function copyFunction(func, dest, name) {
  eval('dest["' + name + '"] = ' + func.toString());
}

module.exports.copyPrototype = copyPrototype;
module.exports.copyFunction = copyFunction;
