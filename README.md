# fast-validator
An extremely fast and Joi like data validator. It shares the Joi schema creation syntax but it's much, much faster.

#### Install
```
npm install fast-validator
```

#### Usage
```javascript
var fast = require('fast-validator');

var rules = fast.string().min(2).max(50);
var data = 'fast-validator';

if (rules.validate(data)) {
  console.log('Valid data!');
} else {
  console.log('Invalid data');
}
```

#### Limitations
* **No input sanitization**: Because the main methods `validate` and `validateList` return a single boolean, fast-validator is not able to sanitize data like Joi (with the method any#strip for example).
* **No descriptive validations**: In the event of wrong validation it only returns a `true` when the data is validated sucessfully or `false` when it is not.

#### Benchmarks
Validating a simple object with strings and numbers one million times is x500 faster than *Joi*.

```javascript
var fastSchema = fast.object().keys({ a:fast.string().min(2).max(50), b: fast.number().min(2).max(50) });
var joiSchema = Joi.object().keys({ a:Joi.string().min(2).max(50), b: Joi.number().min(2).max(50) });
var data = { a: 'alex', b: 5 };

fastSchema.validate(data); // 1,000,000 runs -> 110ms
Joi.validate(data, joiSchema); // 1,000,000 runs -> 55,000ms
```
Check examples folder!

#### jsdoc
http://alemures.github.io/fast-validator/