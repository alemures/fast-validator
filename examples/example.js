'use strict';

var validate = require('../lib/validator').validate;

var data = ['fast', 'validator'];
var rules = { type: 'string', min: 2, max: 50 };

var result = validate(data, rules);

if (result === -1) {
  console.log('Valid data!');
} else {
  console.log('Invalid data found:', data[result]);
}
