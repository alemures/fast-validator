# fast-validator
An extremely fast and Joi like data validator. It shares the Joi schema creation syntax but it's much, much faster.

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

#### Benchmarks
Validating a simple object with strings and numbers one million times will take 120ms against the 20.000ms that will take Joi.

```
var fastSchema = fast.object().keys({ a:fast.string().min(2).max(50), b: fast.number().min(2).max(50) });
var joiSchema = Joi.object().keys({ a:Joi.string().min(2).max(50), b: Joi.number().min(2).max(50) });
var data = { a: 'asdf', b: 3 };
```

#### jsdoc
http://alemures.github.io/fast-validator/