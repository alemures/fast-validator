'use strict';

var fast = require('../index');

var rules = fast.string({ min: 2, max: 50 });

var data = 'fast-validator';
var result = rules.validate(data);

if (result === -1) {
  console.log('Valid data!');
} else {
  console.log('Invalid data found:', data);
}

var dataList = ['fast', 'validator'];
var resultList = rules.validateList(dataList);

if (resultList === -1) {
  console.log('Valid dataList!');
} else {
  console.log('Invalid dataList found:', dataList[resultList]);
}
