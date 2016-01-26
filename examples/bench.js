'use strict';

var validate = require('../lib/validator').validate;

var TIMES = 1e+6;
var start = Date.now();
for (var i = 0; i < TIMES; i++) {
  run();
}

console.log('Final time:', Date.now() - start, 'ms');

function run() {
  validate(['alejandro', 'santiago', 'nieto'], { type:'string', min: 1, max: 10, undef: true, null: true });
  validate([1, 2, 3], { type:'number', min: 1, max: 10, undef: true, null: true });
  validate([true, false, true], { type:'boolean', undef: true, null: true });
  validate([0, 1, 1], { type:'num_boolean', undef: true, null: true });
  validate([[1, 2, 3], ['a', 'b', 'c'], []], { type:'array', min: 1, max: 10, undef: true, null: true });
  validate([{ a:1 }, { b:'2' }, { c:true }], { type:'object', min: 1, max: 10, undef: true, null: true });
}
