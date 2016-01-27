'use strict';

var joi = require('joi');

var schemaString = joi.string().min(1).max(10).allow(null);
var schemaNumber = joi.number().min(1).max(10).allow(null);
var schemaBoolean = joi.boolean();
var schemaNumBoolean = joi.number().valid(1, 2);
var schemaArray = joi.array().min(1).max(10).allow(null);
var schemaObject = joi.object().min(1).max(10).allow(null);

// 13540 ms with 100.000 times, not finish with 1.000.000
var TIMES = 1e+5;
var start = Date.now();
for (var i = 0; i < TIMES; i++) {
  run();
}

console.log('Final time:', Date.now() - start, 'ms');

function run() {
  schemaString.validate('alejandro');
  schemaString.validate('santiago');
  schemaString.validate('nieto');

  schemaNumber.validate(1);
  schemaNumber.validate(2);
  schemaNumber.validate(3);

  schemaBoolean.validate(true);
  schemaBoolean.validate(false);
  schemaBoolean.validate(true);

  schemaNumBoolean.validate(0);
  schemaNumBoolean.validate(1);
  schemaNumBoolean.validate(1);

  schemaArray.validate([1,2,3]);
  schemaArray.validate(['a','b','c']);
  schemaArray.validate([]);

  schemaObject.validate({ a:1 });
  schemaObject.validate({ a:1 });
  schemaObject.validate({ a:1 });
}
