// console.log(arguments);
// console.log(require('module').wrapper);

// module.exports
const C = require('./text-module-1');
const calc1 = new C();
console.log(calc1.add(9, 3));

// exports
// const calc2 = require('./text-module-2');
// console.log(calc2.multiply(2,5));
const {add, multiply, divide} = require('./text-module-2');
console.log(divide(10,2));

// Caching
require('./test-module-3')();
require('./test-module-3')();
require('./test-module-3')();