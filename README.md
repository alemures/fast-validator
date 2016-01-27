# fast-validator
An extremely fast and simple data validator. It's very useful in high performance processes that handle simple data or don't require to be very fussy about the data validation like messages server to server or interprocess communication.

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