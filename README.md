# fast-validator
An extremely fast and simple data validator. It's very useful in high performance processes that handle simple data or don't require to be very fussy about the data validation like messages server to server or interprocess communication.

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