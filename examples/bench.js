'use strict';

var fast = require('../index');

var arrayRules = fast.array({ min: 1, max: 10, undef: true, null: true });
var booleanRules = fast.boolean({ undef: true, null: true });
var bufferRules = fast.buffer({ min: 1, max: 10, undef: true, null: true });
var dateRules = fast.date({ min: new Date('2016-02-01'), max: new Date('2016-02-28'), undef: true, null: true });
var numberRules = fast.number({ min: 1, max: 10, undef: true, null: true });
var numBooleanRules = fast.numBoolean({ undef: true, null: true });
var objectRules = fast.object({ min: 1, max: 10, undef: true, null: true });
var stringRules = fast.string({ min: 1, max: 10, undef: true, null: true });

var arrays = [[1, 2, 3], ['a', 'b', 'c'], []];
var booleans = [true, false, true];
var buffers = [new Buffer('alejandro'), new Buffer('santiago'), new Buffer('nieto')];
var dates = [new Date('2016-02-01'), new Date('2016-02-11'), new Date('2016-02-21')];
var numbers = [1, 2, 3];
var numBoleans = [0, 1, 1];
var objects = [{ a:1 }, { b:'2' }, { c:true }];
var strings = ['alejandro', 'santiago', 'nieto'];

// console.log(arrayRules.validate(arrays[0], arrays[1], arrays[2]));
// console.log(booleanRules.validate(booleans[0], booleans[1], booleans[2]));
// console.log(bufferRules.validate(buffers[0], buffers[1], buffers[2]));
// console.log(dateRules.validate(dates[0], dates[1], dates[2]));
// console.log(numberRules.validate(numbers[0], numbers[1], numbers[2]));
// console.log(numBooleanRules.validate(numBoleans[0], numBoleans[1], numBoleans[2]));
// console.log(objectRules.validate(objects[0], objects[1], objects[2]));
// console.log(stringRules.validate(strings[0], strings[1], strings[2]));

// 35 ms with 100,000 times, 235 ms with 1,000,000
var TIMES = 1e+6;
var start = Date.now();

for (var i = 0; i < TIMES; i++) {
  run();
}

console.log('Final time:', Date.now() - start, 'ms');

function run() {
  arrayRules.validate(arrays[0], arrays[1], arrays[2]); // 34
  booleanRules.validate(booleans[0], booleans[1], booleans[2]); // 20
  bufferRules.validate(buffers[0], buffers[1], buffers[2]); // 31
  dateRules.validate(dates[0], dates[1], dates[2]); // 40
  numberRules.validate(numbers[0], numbers[1], numbers[2]); // 25
  numBooleanRules.validate(numBoleans[0], numBoleans[1], numBoleans[2]); // 21
  objectRules.validate(objects[0], objects[1], objects[2]); // 53
  stringRules.validate(strings[0], strings[1], strings[2]); // 28

  // arrayRules.validateList(arrays);
  // booleanRules.validateList(booleans);
  // bufferRules.validateList(buffers);
  // dateRules.validateList(dates);
  // numberRules.validateList(numbers);
  // numBooleanRules.validateList(numBoleans);
  // objectRules.validateList(objects);
  // stringRules.validateList(strings);
}
