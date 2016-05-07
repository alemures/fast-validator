# fast-validator
An extremely fast and Joi like data validator. It shares the Joi schema creation syntax and tries to get the maximum performance sacrificing descriptive error logs.

#### Install
```
npm install fast-validator
```

#### Usage
```
var fast = require('fast-validator');

var rules = fast.string().min(2).max(50);
var data = 'fast-validator';

if (rules.validate(data)) {
  console.log('Valid data!');
} else {
  console.log('Invalid data');
}
```

#### Examples
Check examples folder!

#### jsdoc
http://alemures.github.io/fast-validator/