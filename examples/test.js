'use strict';

var fast = require('../index');

var rules = fast.object().keys({
  a: fast.number(),
  b: fast.object().keys({c: fast.number().optional() }).required(),
  c: fast.array().min(1)
});

var data = {b:{c:1}, c:[1]};
var result = rules.validate(data);

if (result === -1) {
  console.log('Valid data!');
} else {
  console.log('Invalid data found:', data);
}
