'use strict';

function copyPrototype(ctor, superCtor) {
  for (var name in superCtor.prototype) {
    copyFunction(superCtor.prototype[name], name, ctor.prototype);
  }
}

var copyFunctionCounter = 0;
function copyFunction(func, name, dest) {
  var funcName = name + (++copyFunctionCounter);
  var funcData = func.toString().replace(/function.*\(/, 'function ' + funcName + ' (');

  /*jshint evil:true*/
  eval('dest.' + name + ' = ' + funcData + ';');
  /*jshint evil:false*/
}

function hardInherits(ctor, superCtor) {
  if (ctor === undefined || ctor === null) {
    throw new TypeError('The constructor to "inherits" must not be ' +
                        'null or undefined');
  }

  if (superCtor === undefined || superCtor === null) {
    throw new TypeError('The super constructor to "inherits" must not ' +
                        'be null or undefined');
  }

  if (superCtor.prototype === undefined) {
    throw new TypeError('The super constructor to "inherits" must ' +
                        'have a prototype');
  }

  ctor.super_ = superCtor;
  copyPrototype(ctor, superCtor);
}

module.exports.copyPrototype = copyPrototype;
module.exports.copyFunction = copyFunction;
module.exports.hardInherits = hardInherits;
