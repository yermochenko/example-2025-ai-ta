const input = require('readline-sync');

const digit = require('./digit.js');

console.log('***** Подсчёт количества цифр числа ****');
console.log('Введите целое число:');
let n = input.questionInt();
console.log(`Количество цифр во введённом числе: ${digit(n)}.`);
