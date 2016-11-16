'use strict';

var fast = require('../index');

var rules = fast.string().min(2).max(50);

var data = 'fast-validator';

if (rules.validate(data)) {
  console.log('Valid data!');
} else {
  console.log('Invalid data');
}

var dataList = ['fast', 'validator'];

if (rules.validateList(dataList)) {
  console.log('Valid dataList!');
} else {
  console.log('Invalid dataList');
}
