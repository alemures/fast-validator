'use strict';

var validate = require('../lib/validator').validate;

var stringRules = { type:'string', min: 1, max: 10, undef: true, null: true };
var numberRules = { type:'number', min: 1, max: 10, undef: true, null: true };
var booleanRules = { type:'boolean', undef: true, null: true };
var numBooleanRules = { type:'num_boolean', undef: true, null: true };
var arrayRules = { type:'array', min: 1, max: 10, undef: true, null: true };
var objectRules = { type:'object', min: 1, max: 10, undef: true, null: true };

// 35 ms with 100.000 times, 280 ms with 1.000.000
var TIMES = 1e+5;
var start = Date.now();
for (var i = 0; i < TIMES; i++) {
  run();
}

console.log('Final time:', Date.now() - start, 'ms');

function run() {
  validate(['alejandro', 'santiago', 'nieto'], stringRules);
  validate([1, 2, 3], numberRules);
  validate([true, false, true], booleanRules);
  validate([0, 1, 1], numBooleanRules);
  validate([[1, 2, 3], ['a', 'b', 'c'], []], arrayRules);
  validate([{ a:1 }, { b:'2' }, { c:true }], objectRules);
}
