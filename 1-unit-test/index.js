const input = require('readline-sync');

const digit = require('./digit.js');

console.log('******** Подсчёт количества цифр числа ********');
console.log('Введите целое число:');
let n = input.questionInt();
console.log(`Количество цифр во введённом числе: ${digit(n)}.`);


const solve = require('./solve.js');

console.log('*** Решение уравнения вида ax² + bx + c = 0 ***');
console.log('Введите коэффициенты уравнения:');
let a = input.questionFloat('a = ');
let b = input.questionFloat('b = ');
let c = input.questionFloat('c = ');
try {
    answer = solve(a, b, c);
    if(answer.length > 1) {
        console.log(`Уравнение имеет два различных корня: ${answer[0]} и ${answer[1]}.`);
    } else if(answer.length === 1) {
        console.log(`Уравнение имеет единственный корень: ${answer[0]}.`);
    } else {
        console.log(`Уравнение не имеет корей.`);
    }
} catch {
    console.log('Любое число является корнем данного уравнения.');
}


const pow = require('./pow.js');

console.log('***** Возведение числа в заданную степень *****');
console.log('Введите вещественное число - основание степени:');
let x = input.questionFloat();
console.log('Введите целое положительное число - показатель степени:');
let k = input.questionInt();
console.log(`${x}^${k} = ${pow(x, k)}`);
