# fast-validator
A fast and simple data validator.

#### Install
```
npm install fast-validator
```

#### Usage
```
var validate = require('fast-validator').validate;

var data = ['fast', 'validator'];
var rules = { type: 'string', min: 2, max: 50 };

var result = validate(data, rules);
console.log('Result:', result);
```

#### Type values
* string
* number
* boolean
* object
* array
* num_boolean

#### Examples
Check examples folder!

#### jsdoc
http://alemures.github.io/fast-validator/