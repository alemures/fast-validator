'use strict';

var fast = require('../index');

var arrayRules = fast.array().min(1).max(10);
var booleanRules = fast.boolean();
var bufferRules = fast.buffer().min(1).max(10);
var dateRules = fast.date().min(new Date('2016-02-01')).max(new Date('2016-02-28'));
var numberRules = fast.number().min(1).max(10);
var objectRules = fast.object().min(1).max(10);
var stringRules = fast.string().min(1).max(10);

var arrays = [[1, 2, 3], ['a', 'b', 'c'], [true]];
var booleans = [true, false, true];
var buffers = [new Buffer('alejandro'), new Buffer('santiago'), new Buffer('nieto')];
var dates = [new Date('2016-02-01'), new Date('2016-02-11'), new Date('2016-02-21')];
var numbers = [1, 2, 3];
var objects = [{ a: 1 }, { b: '2' }, { c: true }];
var strings = ['alejandro', 'santiago', 'nieto'];

// console.log(arrayRules.validate(arrays[0], arrays[1], arrays[2]));
// console.log(booleanRules.validate(booleans[0], booleans[1], booleans[2]));
// console.log(bufferRules.validate(buffers[0], buffers[1], buffers[2]));
// console.log(dateRules.validate(dates[0], dates[1], dates[2]));
// console.log(numberRules.validate(numbers[0], numbers[1], numbers[2]));
// console.log(objectRules.validate(objects[0], objects[1], objects[2]));
// console.log(stringRules.validate(strings[0], strings[1], strings[2]));

// 38 ms with 100,000 times, 256 ms with 1,000,000
var TIMES = 1e+6;
var start = Date.now();

for (var i = 0; i < TIMES; i++) {
  run();
}

console.log('Final time:', Date.now() - start, 'ms');

function run() {
  arrayRules.validate(arrays[0], arrays[1], arrays[2]); // 36 ms
  booleanRules.validate(booleans[0], booleans[1], booleans[2]); // 18 ms
  bufferRules.validate(buffers[0], buffers[1], buffers[2]); // 34 ms
  dateRules.validate(dates[0], dates[1], dates[2]); // 42 ms
  numberRules.validate(numbers[0], numbers[1], numbers[2]); // 22 ms
  objectRules.validate(objects[0], objects[1], objects[2]); // 66 ms
  stringRules.validate(strings[0], strings[1], strings[2]); // 36 ms

  // arrayRules.validateList(arrays);
  // booleanRules.validateList(booleans);
  // bufferRules.validateList(buffers);
  // dateRules.validateList(dates);
  // numberRules.validateList(numbers);
  // objectRules.validateList(objects);
  // stringRules.validateList(strings);

  // arrayRules.validate(undefined, undefined, undefined);
  // booleanRules.validate(undefined, undefined, undefined);
  // bufferRules.validate(undefined, undefined, undefined);
  // dateRules.validate(undefined, undefined, undefined);
  // numberRules.validate(undefined, undefined, undefined);
  // objectRules.validate(undefined, undefined, undefined);
  // stringRules.validate(undefined, undefined, undefined);
}
